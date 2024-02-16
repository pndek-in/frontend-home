import { redirect } from "@remix-run/node"
import { userState, globalToast } from "~/services/cookies.server"

export const action = async () => {
  const headers = new Headers()
  headers.append(
    "Set-Cookie",
    await userState.serialize({ token: "" }, { path: "/" })
  )
  headers.append(
    "Set-Cookie",
    await globalToast.serialize({
      content: "Logout successfully",
      type: "success"
    })
  )

  return redirect("/", {
    headers
  })
}
