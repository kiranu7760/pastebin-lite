export const dynamic = "force-dynamic";


import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(
        JSON.stringify({ error: "content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return new Response(
        JSON.stringify({ error: "ttl_seconds must be an integer >= 1" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return new Response(
        JSON.stringify({ error: "max_views must be an integer >= 1" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = nanoid(8);
    const now = Date.now();

    const paste = {
      id,
      content,
      created_at: now,
      expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views_used: 0,
    };

    await redis.set(`paste:${id}`, JSON.stringify(paste));


    const origin =
  req.headers.get("origin") ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

return new Response(
  JSON.stringify({
    id,
    url: `${origin}/p/${id}`,
  }),

      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
