export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redis } from "@/lib/redis";

function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return Number(testNow);
  }
  return Date.now();
}

export async function GET(req, context) {
  
  const { id } = await context.params;

  const paste = await redis.get(`paste:${id}`);

  if (!paste) {
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const now = getNow(req);

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(`paste:${id}`);
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // View limit check
  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    await redis.del(`paste:${id}`);
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  paste.views_used += 1;
  await redis.set(`paste:${id}`, paste);

  return new Response(
    JSON.stringify({
      content: paste.content,
      remaining_views:
        paste.max_views !== null
          ? paste.max_views - paste.views_used
          : null,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
