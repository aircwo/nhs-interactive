import { LOCAL_DB_URL } from "@/app/lib/utils/constants";
import PocketBase from "pocketbase";

export const runtime = 'edge';

/**
 * This POST handler takes two params from the request object 
 * and uses them to log data into a pocketbase db.
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
  if (!process.env.DB_STORE) 
    return new Response("Logged response - no db");
  
  const { searchQuery, answer } = (await req.json()) as {
    searchQuery: {
      query: string;
      sourceLinks: string[];
    },
    answer: string;
  };

  const pb = new PocketBase(process.env.DB_URL ?? LOCAL_DB_URL);

  const record = await pb.collection('searches').create({
    "query": searchQuery?.query,
    "result": answer,
    "links": searchQuery?.sourceLinks
  });

  if(!record.ok) {
    return new Response("Failed to log", { status: record.code });
  }

  return new Response("Logged response");
};
