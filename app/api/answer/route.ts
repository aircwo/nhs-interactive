import { HealthAPIResponse } from "@/types";
import { NextResponse } from "next/server";

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
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { query, lang } = (await req.json()) as {
      query: string;
      lang: string;
    };

    const key = process.env.HEALTH_AI_API_KEY;
    if (!key) {
      throw new Error('Api key not set');
    }

    const res = await fetch(process.env.HEALTH_AI_API_URL ?? "", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      method: "POST",
      body: JSON.stringify({
        query: query,
        lang: lang,
      }),
    });

    if (res.status !== 200) {
      console.log('Status: ' + res.status);
      throw new Error("API returned an error");
    }
    const data: HealthAPIResponse = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({}, { status: 500, statusText: error.message ?? error.statusText });
  }
};
