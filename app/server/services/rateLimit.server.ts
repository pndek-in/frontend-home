import { getRedisClient } from "../config/redis.server"

/**
 * Fixed-window rate limiter backed by Redis.
 * Fails open (allows the request) if Redis is unavailable.
 */
export const checkRateLimit = async (
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; retryAfter: number }> => {
  try {
    const client = await getRedisClient()
    const redisKey = `ratelimit:${key}`
    const count = await client.incr(redisKey)
    if (count === 1) await client.expire(redisKey, windowSeconds)

    if (count > limit) {
      const ttl = await client.ttl(redisKey)
      return { allowed: false, retryAfter: ttl > 0 ? ttl : windowSeconds }
    }
    return { allowed: true, retryAfter: 0 }
  } catch (err) {
    console.log(`Rate limit error: ${err}`)
    return { allowed: true, retryAfter: 0 }
  }
}

export const getClientIp = (request: Request): string => {
  // Behind cloudflared tunnel, Cloudflare sets the real visitor IP here
  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp.trim()

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}
