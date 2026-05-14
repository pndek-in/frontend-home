import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { AuthForm } from "~/components/shared"
import { userState, globalToast } from "~/services/cookies.server"
import { login } from "~/server/services/auth.server"

type ActionError = {
  email?: string
  password?: string
  toast?: string
}

export const handle = {
  i18n: ["meta"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-login-title") },
    { name: "description", content: t("meta-login-desc") }
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const errors: ActionError = {}

  if (!email) errors.email = "Email is required"
  if (!password) errors.password = "Password is required"
  if (Object.keys(errors).length > 0) return json({ errors })

  try {
    const response = await login({ email, password })
    const headers = new Headers()

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
    return json({ errors: { toast: err.message } })
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>()

  return <AuthForm type="login" actionData={actionData} />
}
