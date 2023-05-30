import { openAIStream } from "@/app/lib/utils/functions";
import { OpenAIModel } from "@/types";

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
    const { model, prompt, apiKey } = (await req.json()) as {
      model: OpenAIModel;
      prompt: string;
      apiKey: string;
    };

    const stream = await openAIStream(model, prompt, apiKey);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
