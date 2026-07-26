import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstashConfig =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = hasUpstashConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
    })
  : null;

/**
 * Returns false when the caller has exceeded the limit.
 *
 * Fails open: if Upstash is unconfigured or unreachable we let the request
 * through and log loudly. A dead rate limiter should never take the contact
 * form offline — dropping genuine enquiries is worse than the spam risk, and
 * the payload is still schema-validated.
 */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!ratelimit) {
    console.warn(
      "Rate limiting disabled: UPSTASH_REDIS_REST_URL/TOKEN not configured."
    );
    return true;
  }

  try {
    const { success } = await ratelimit.limit(identifier);
    return success;
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return true;
  }
}
