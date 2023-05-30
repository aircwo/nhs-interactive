import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

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
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
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
