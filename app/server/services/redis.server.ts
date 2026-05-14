import { getRedisClient } from "../config/redis.server"
import { User, Link, Click } from "../models/index.server"

type RedisKey = "totalUser" | "totalLink" | "totalClick"

export const getRedis = async (key: string): Promise<string | null> => {
  const client = await getRedisClient()
  return client.get(key)
}

export const updateRedis = async (key: RedisKey): Promise<void> => {
  let value: number
  switch (key) {
    case "totalUser":
      value = await User.count()
      break
    case "totalLink":
      value = await Link.count()
      break
    case "totalClick":
      value = await Click.count()
      break
    default:
      return
  }
  const client = await getRedisClient()
  await client.set(key, String(value))
  console.log(`Set ${key} to ${value}`)
}

export const refreshRedis = async (): Promise<void> => {
  await updateRedis("totalUser")
  await updateRedis("totalLink")
  await updateRedis("totalClick")
}
