import { json } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"
import { authenticateBot } from "~/server/auth/authenticate.server"
import { createLink } from "~/server/services/link.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined
  const source = new URL(request.url).searchParams.get("source") || "telegram"

  try {
    const userData = await authenticateBot(token)
    const body = await request.json()
    const response = await createLink(body, userData.userId, source)
    return json(response, { status: 201 })
  } catch (err: any) {
    return json({ message: err.message }, { status: err.status || 500 })
  }
}
