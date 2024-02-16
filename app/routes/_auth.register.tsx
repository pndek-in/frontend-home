import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { AuthForm } from "~/components/shared"
import { apiHelper } from "~/utils/helpers"
import { userState, globalToast } from "~/services/cookies.server"
import API from "~/utils/api"

type ActionError = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
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

  const name = String(formData.get("name")) as string
  const email = String(formData.get("email")) as string
  const password = String(formData.get("password")) as string
  const confirmPassword =
    String(formData.get("confirmPassword")) as string

  const errors: ActionError = {}

  if (!name) {
    errors.name = "Name is required"
  }

  if (!email) {
    errors.email = "Email is required"
  }

  if (!password) {
    errors.password = "Password is required"
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required"
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Confirm Password must be same with Password"
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors })
  }

  const payload = { name, email, password }
  const response = await API.auth.registerRequest(payload, apiHelper)

  if (response.status === 201) {
    const headers = new Headers()

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
    return json({
      errors: {
        toast: response.message
      }
    })
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>()

  return <AuthForm type="register" actionData={actionData} />
}
