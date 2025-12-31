import { redis } from "@/lib/redis";

export async function GET() {
  try {
    // lightweight Redis check
    await redis.set("__healthcheck", "ok", { ex: 5 });
    const value = await redis.get("__healthcheck");

    if (value !== "ok") {
      throw new Error("Redis healthcheck failed");
    }

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Healthz error:", error);

    return new Response(
      JSON.stringify({ ok: false }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
