import { json } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { authenticateBot } from "~/server/auth/authenticate.server"
import { getLinkList } from "~/server/services/link.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined
  const status = Number(new URL(request.url).searchParams.get("status") ?? "1")

  try {
    const userData = await authenticateBot(token)
    const links = await getLinkList(userData.userId, status)
    return json({ message: "Links is successfully retrieved", data: links }, { status: 200 })
  } catch (err: any) {
    return json({ message: err.message }, { status: err.status || 500 })
  }
}
