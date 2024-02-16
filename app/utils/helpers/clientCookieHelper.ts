import { parse, serialize } from "cookie"

function get(name: string, cookies: string) {
  const parsedCookies = parse(cookies || "")
  return parsedCookies[name]
}

function stringify(
  name: string,
  value: string,
  options: any = {}
) {
  const stringValue = typeof value === "object" ? JSON.stringify(value) : value
  const cookie = serialize(name, stringValue, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...options
  })
  return cookie
}

export default {
  get,
  stringify
}