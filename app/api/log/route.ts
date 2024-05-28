import { LOCAL_DB_URL } from "@/app/utils/constants";
import { LogData } from "@/types";
import { NextResponse } from "next/server";
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
export async function POST(req: Request): Promise<Response|NextResponse> {
  if (!process.env.DB_STORE) return new Response("Logged response - no db");

  const { searchQuery, answer, feedback, id } = (await req.json()) as LogData;
  
  try {
    const pb = new PocketBase(process.env.DB_URL ?? LOCAL_DB_URL);
    if (!id) {
      const res = await pb.collection("searches").create({
        query: searchQuery?.query,
        result: answer,
        links: JSON.stringify(searchQuery?.sourceLinks),
        db_access_key: process.env.DB_ACCESS_KEY,
      });
      return NextResponse.json({ id: res.id }, { status: 200 });
    }
    if (feedback && id) {
      await pb.collection("feedback").create({
        field: id,
        helpful: feedback.helpful,
        note: JSON.stringify(feedback.comment),
        db_access_key: process.env.DB_ACCESS_KEY,
      });
    }
  } catch (error) {
    console.log("Pocketbase threw error: ", error);
    return new Response("Failed to log", { status: 500 });
  }

  return new Response("Logged response");
}
