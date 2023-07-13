import { SearchQuery, Source } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { UNRELATED_ANSWER, USE_AI_RESPONSE_KEY } from "./constants";
import endent from "endent";

/**
 * @async
 * @function openAIStream
 * @param {string} model - The model name to use for the OpenAI API request.
 * @param {string} prompt - The prompt to send for the chat completion.
 * @param {string} apiKey - The OpenAI API key for the request.
 * @returns {Promise<ReadableStream>} A readable stream that fetches and parses the response from the OpenAI API.
 */
export const openAIStream = async (model: string, prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: "You are a medical professional that accurately answers the user's queries based on the given text and you only get your information and facts from NHS websites." },
        { role: "user", content: prompt }
      ],
      max_tokens: 120,
      temperature: 0.1,
      stream: true,
      stop: "\n"
    })
  });

  if (res.status !== 200) {
    if (res.status === 429) {
      throw new Error("Your API key has hit too many requests");
    }
    console.log('Status: ' + res.status);
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};


/**
 * This code exports a function named `cleanSourceText` that takes a string as input and returns a modified version of the
 * string with certain characters and patterns replaced or removed. The modifications include removing leading and trailing
 * whitespace, replacing multiple consecutive newlines with a single space, replacing multiple consecutive spaces with a
 * single space, removing tabs, and removing excess newlines.
 * 
 * @function
 * @name cleanSourceText
 * @kind variable
 * @param {string} text
 * @returns {string}
 * @exports
 */
export const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

/**
 * Asynchronous function that sends a POST request to the `/api/sources` endpoint with the `query`
 * parameter as the request body. Returns an array of `Source` objects from the response
 * body.
 * 
 * @async
 * @function
 * @name fetchSources
 * @kind variable
 * @param {string} query
 * @returns {Promise<Source[]>}
 * @exports
 */
export const fetchSources = async (query: string) => {
  const response = await fetch("/api/sources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  let { sources }: { sources: Source[] } = await response.json();
  if (!sources || sources.length <= 0) {
    sources = [{ url: USE_AI_RESPONSE_KEY, text: '' }];
  }
  return sources;
};

/**
 * A function that takes in several parameters. It is an asynchronous function that sends a POST request to the `/api/answer` endpoint with the `prompt`
 * and `apiKey` as the request body. It then reads the response body as a stream and updates the answer using the
 * `onAnswerUpdate` callback function. Finally, it sets the `done` state to `true` using the `onDone` callback function and
 * sets the `loading` state to `false` using the `setLoading` callback function. If an error occurs, it updates the answer
 * with the `UNRELATED_ANSWER` constant.
 * @async
 * @function
 * @name handleStream
 * @kind variable
 * @param {string} query
 * @param {Source[]} sources
 * @param {(answer: string) => void} onAnswerUpdate
 * @param {(searchQuery: SearchQuery) => void} onSearch
 * @param {(done: boolean) => void} onDone
 * @param {(loading: boolean) => void} setLoading
 * @param {string} lang
 * @returns {Promise<void>}
 * @exports
 */
export const handleStream = async (query: string, sources: Source[], onAnswerUpdate: (answer: string) => void, onSearch: (searchQuery: SearchQuery) => void, onDone: (done: boolean) => void, setLoading: (loading: boolean) => void, lang: string): Promise<void> => {
  if (sources.length <= 0) {
    setLoading(false);
    onAnswerUpdate(UNRELATED_ANSWER);
    onSearch({ query, sourceLinks: [], sourceHeadings: [] });
    return;
  }
  let prompt = endent`In ${lang}, provide a short answer to the query based on the following sources. The answer must end on a full stop and be concise, accurate, and helpful. Cite sources as [1] or [2] or [3] after each sentence (not just the very end) to back up your answer (Ex: Correct: [1], Correct: [2][3], Incorrect: [1, 2]).
  ${sources
    .map((source, idx) => `Source [${idx + 1}]:\n${source.text}`)
    .join("\n\n")}
  `;

  const sourceLinks = sources.map((source) => source.url);
  const sourceHeadings = sources.map((source) => source.heading);
  if (sourceLinks[0] === USE_AI_RESPONSE_KEY) {
    sourceLinks[0] = `https://www.nhs.uk/search/results?q=${query}`;
    prompt = endent`In ${lang}, provide a short medical answer to the query that must end on a full stop and be concise, accurate, and informative. If you can't answer the query, respond with: '${UNRELATED_ANSWER}'. Query: ${query}`;
  }

  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // call this here to ensure query is shown before answer
    onSearch({ query, sourceLinks: sourceLinks, sourceHeadings: sourceHeadings });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      if (!reader) break;
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      onAnswerUpdate(chunkValue);
    }

    onDone(true);
  } catch (error: any) {
    onAnswerUpdate(UNRELATED_ANSWER);
    onSearch({ query: error.message ?? 'Error', sourceLinks: [], sourceHeadings: [] });
  } finally {
    setLoading(false);
  }
};
