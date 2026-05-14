import { createClient } from "redis"

type RedisClient = ReturnType<typeof createClient>

declare global {
  var __redisClient: RedisClient | undefined
}

async function createRedisClient(): Promise<RedisClient> {
  const client = createClient({ url: process.env.REDIS_URL })

  client.on("connect", () => console.log("Redis client connected"))
  client.on("error", (err) => console.log(`Redis error: ${err}`))

  await client.connect()
  return client
}

export async function getRedisClient(): Promise<RedisClient> {
  if (!global.__redisClient) {
    global.__redisClient = await createRedisClient()
  }
  return global.__redisClient
}
