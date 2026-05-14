import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { AuthForm } from "~/components/shared"
import { userState, globalToast } from "~/services/cookies.server"
import { register } from "~/server/services/auth.server"

type ActionError = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  toast?: string
}

export const handle = {
  i18n: ["meta"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-register-title") },
    { name: "description", content: t("meta-register-desc") }
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = String(formData.get("name"))
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const confirmPassword = String(formData.get("confirmPassword"))

  const errors: ActionError = {}

  if (!name) errors.name = "Name is required"
  if (!email) errors.email = "Email is required"
  if (!password) errors.password = "Password is required"
  if (!confirmPassword) errors.confirmPassword = "Confirm Password is required"
  if (password !== confirmPassword)
    errors.confirmPassword = "Confirm Password must be same with Password"

  if (Object.keys(errors).length > 0) return json({ errors })

  try {
    const response = await register({ name, email, password })
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

export default function Register() {
  const actionData = useActionData<typeof action>()

  return <AuthForm type="register" actionData={actionData} />
}
