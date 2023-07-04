import { Source, SourceData } from "@/types";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { cleanSourceText } from "@/app/lib/utils/functions";
import { load } from "cheerio";
import { NextResponse } from "next/server";

const SEARCH_URL = "https://www.google.co.uk/search?q=";
const URL_WHITELIST = ["hscni.net", "nhs24.scot", "nhs.wales", "nhsbsa", "gov.uk", "nhs.uk"];

export async function POST(req: Request): Promise<NextResponse<SourceData>> {
  try {
    const { query } = JSON.parse(await req.text()) as {
      query: string;
    };

    const response = await fetch(SEARCH_URL + query);
    const html = await response.text();
    const $ = load(html);
    const linkTags = $("a");

    let links: string[] = [];

    linkTags.each((i, link) => {
      const href = $(link).attr("href");

      if (href && href.startsWith("/url?q=")) {
        const cleanedHref = href.replace("/url?q=", "").split("&")[0];

        if (!links.includes(cleanedHref)) {
          links.push(cleanedHref);
        }
      }
    });

    const filteredLinks: string[] = [];
    for (const link of links) {
      const domain = new URL(link).hostname;

      if (URL_WHITELIST.some((site) => domain.includes(site))) {
        if (!filteredLinks.some((filteredLink) => new URL(filteredLink).hostname === domain)) {
          filteredLinks.push(link);
        }
      }
    }

    const numberOfSources = 4;
    const finalLinks = filteredLinks.slice(0, numberOfSources);

    const sources = (await Promise.all(
      finalLinks.map(async (link) => {
        const response = await fetch(link);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();

        if (parsed) {
          let sourceText = cleanSourceText(parsed.textContent);
          console.log("link: " + link);
          
          return { url: link, text: sourceText };
        }
      })
    )) as Source[];

    const filteredSources = sources.filter((source) => source !== undefined);

    for (const source of filteredSources) {
      source.text = source.text.slice(0, 1000);
    }

    if (filteredSources.length <= 0) {
      console.log("No sources found, searching NHS");
      const nhsSearchResults = await fetchNhsSearchResults(query);
      filteredSources.push(...nhsSearchResults);
    }
    const responseHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    };
    return NextResponse.json({ sources: filteredSources }, { status: 200, headers: responseHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ sources: [] }, { status: 500 });
  }
}

/**
 * The `fetchNhsSearchResults` function is an asynchronous function that takes a `query` parameter of type string. It
 * fetches search results from the NHS website based on the provided query.
 * 
 * @async
 * @function
 * @name fetchNhsSearchResults
 * @kind function
 * @param {string} query
 * @returns {Promise<Source[]>}
 */
async function fetchNhsSearchResults(query: string) {
  const nhsSearchUrl = `https://www.nhs.uk/search/results?q=${query}`;
  const response = await fetch(nhsSearchUrl);
  const html = await response.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const results = doc.querySelectorAll('ul.nhsuk-list li');

  // 3 is the default number of li elements on the page without results.
  if (results.length <= 3) return [];
  const sources: Source[] = [];
  let sourceText = '';
  results.forEach((result) => {
    const snippetElement = result.querySelector('p.nhsuk-body-s');
    const snippet = snippetElement?.textContent ? snippetElement.textContent.trim() : '';
    sourceText += snippet;
  });
  sources.push({ url: nhsSearchUrl, text: sourceText });
  return sources;
}