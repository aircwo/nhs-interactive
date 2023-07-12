import { LOCAL_DB_URL } from "@/app/utils/constants";
import PocketBase from "pocketbase";

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
  if (!process.env.DB_STORE) return new Response("Logged response - no db");

  const { searchQuery, answer } = (await req.json()) as {
    searchQuery: {
      query: string;
      sourceLinks: string[];
    };
    answer: string;
  };

  try {
    const pb = new PocketBase(process.env.DB_URL ?? LOCAL_DB_URL);

    await pb.collection("searches").create({
      query: searchQuery?.query,
      result: answer,
      links: searchQuery?.sourceLinks,
      db_access_key: process.env.DB_ACCESS_KEY,
    });
  } catch (error) {
    return new Response("Failed to log", { status: 500 });
  }

  return new Response("Logged response");
}
