import { OpenAIModel } from "@/app/utils/constants";
import { openAIStream } from "@/app/utils/functions";

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
    const { prompt } = (await req.json()) as {
      prompt: string;
    };

    const key = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL ?? OpenAIModel.DAVINCI_TURBO;
    if (!key) {
      throw new Error('Api key not set');
    }
    const stream = await openAIStream(model, prompt, key);
    return new Response(stream);
  } catch (error: any) {
    console.error(error);
    return new Response(error.statusText, { status: 500, statusText: error.message ?? error.statusText });
  }
};
