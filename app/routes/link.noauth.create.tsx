import { json } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { isUrlValid } from "~/utils/helpers"
import { createLinkWithoutAuth } from "~/server/services/link.server"
import { checkRateLimit, getClientIp } from "~/server/services/rateLimit.server"

const ALLOWED_ORIGINS = ["chrome-extension://jdleaoebpoodpagflimepfjpficadcgh"]
const RATE_LIMIT = 10
const RATE_WINDOW_SECONDS = 60

const corsHeaders = (request: Request): Record<string, string> => {
  const origin = request.headers.get("origin") || ""
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  }
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin
  }
  return headers
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(
    { message: "Method not allowed" },
    { status: 405, headers: corsHeaders(request) }
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = corsHeaders(request)

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers })
  }

  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, { status: 405, headers })
  }

  const ip = getClientIp(request)
  const { allowed, retryAfter } = await checkRateLimit(
    `noauth-create:${ip}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS
  )
  if (!allowed) {
    return json(
      { message: "Too many requests, please try again later" },
      { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return json({ message: "Invalid JSON body" }, { status: 400, headers })
  }

  const url = typeof body?.url === "string" ? body.url.trim() : ""
  if (!url) {
    return json({ message: "Link is required!" }, { status: 400, headers })
  }
  if (!isUrlValid(url)) {
    return json({ message: "Link is not valid!" }, { status: 400, headers })
  }

  const source = new URL(request.url).searchParams.get("source") || "extension"

  try {
    const response = await createLinkWithoutAuth(
      {
        url,
        description: body.description,
        expiredAt: body.expiredAt,
        secretCode: body.secretCode
      },
      source
    )
    return json(response, { status: 201, headers })
  } catch (err: any) {
    return json({ message: err.message }, { status: err.status || 500, headers })
  }
}
