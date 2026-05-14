import { json } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { authenticateBot } from "~/server/auth/authenticate.server"
import { getMe } from "~/server/services/auth.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined

  try {
    const userData = await authenticateBot(token)
    const response = getMe(userData)
    return json(response, { status: 200 })
  } catch (err: any) {
    return json({ message: err.message }, { status: err.status || 500 })
  }
}
