import { createCookie } from "@remix-run/node"

const defaultOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
} as const

export const userState = createCookie("user", defaultOptions)
export const globalToast = createCookie("toast", {
  ...defaultOptions,
  maxAge: 1
})