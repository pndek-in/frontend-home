import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"

import { userState, globalToast } from "~/services/cookies.server"
import { googleAuth } from "~/server/services/auth.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData()
  const credential = form.get("credential") as string

  const headers = new Headers()

  try {
    const response = await googleAuth(credential)

    headers.append(
      "Set-Cookie",
      await globalToast.serialize({ content: response.message, type: "success" })
    )
    headers.append(
      "Set-Cookie",
      await userState.serialize({
        token: response.data.token,
        email: response.data.email,
        name: response.data.name,
        isVerified: response.data.isVerified
      })
    )

    return redirect("/dashboard", { headers })
  } catch (err: any) {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({ content: err.message, type: "error" })
    )

    return redirect("/", { headers })
  }
}
