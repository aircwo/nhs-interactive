import { Source, SourceData } from "@/types";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { cleanSourceText } from "@/app/lib/utils/functions";
import { load } from "cheerio";
import { NextResponse } from "next/server";

const SEARCH_URL = "https://www.google.com/search?q=";
const URL_WHITELIST = ["nhs", "nhsbsa", "gov.uk", "nhs.uk"];

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

    const filteredLinks = links.filter((link, idx) => {
      const domain = new URL(link).hostname;

      if (!URL_WHITELIST.some((site) => domain.includes(site))) return false;
      return (
        links.findIndex((link) => new URL(link).hostname === domain) === idx
      );
    });

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

          return { url: link, text: sourceText };
        }
      })
    )) as Source[];

    const filteredSources = sources.filter((source) => source !== undefined);

    for (const source of filteredSources) {
      source.text = source.text.slice(0, 1500);
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
