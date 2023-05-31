import { OpenAIModel } from "@/app/lib/utils/constants";
import { openAIStream } from "@/app/lib/utils/functions";

export const runtime = 'edge';

/**
 * This POST handler takes three params from the request object 
 * and uses them to retrieve an OpenAIStream.
 * 
 * @async
 * @function
 * @name POST
 * @kind function
 * @param {Request} req
 * @returns {Promise<Response>}
 * @exports
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt, apiKey } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };

    const key = apiKey === 'local' ? process.env.OPENAI_API_KEY : apiKey;
    const model = process.env.OPENAI_MODEL ?? OpenAIModel.DAVINCI_TURBO;

    const stream = await openAIStream(model, prompt, key);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
