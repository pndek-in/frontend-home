import { json } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"
import { authenticateBot } from "~/server/auth/authenticate.server"
import { authorizeLink } from "~/server/auth/authorize-link.server"
import { updateLink } from "~/server/services/link.server"

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined
  const id = Number(params.id)

  try {
    const userData = await authenticateBot(token)
    const existingLink = await authorizeLink(id, userData.userId)
    const body = await request.json()
    const response = await updateLink(id, existingLink.path, body)
    return json(response, { status: 200 })
  } catch (err: any) {
    return json({ message: err.message }, { status: err.status || 500 })
  }
}
