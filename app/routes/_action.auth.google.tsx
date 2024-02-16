import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"

import { apiHelper } from "~/utils/helpers"
import { userState, globalToast } from "~/services/cookies.server"
import API from "~/utils/api"

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData()
  const credential = form.get("credential") as string
  const g_csrf_token = form.get("g_csrf_token") as string

  const payload = { credential, g_csrf_token }
  const response = await API.auth.googleAuthRequest(payload, apiHelper)

  const headers = new Headers()

  if (response.status === 200 || response.status === 201) {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({
        content: response.message,
        type: "success"
      })
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

    return redirect("/dashboard", {
      headers
    })
  } else {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({
        content: response.message,
        type: "error"
      })
    )

    return redirect("/", {
      headers
    })
  }
}
