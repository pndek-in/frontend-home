import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { AuthForm } from "~/components/shared"
import { apiHelper } from "~/utils/helpers"
import { userState, globalToast } from "~/services/cookies.server"
import API from "~/utils/api"

type ActionError = {
  email?: string
  password?: string
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

  // Extract and convert values
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const errors: ActionError = {}

  // Validation
  if (!email) {
    errors.email = "Email is required"
  }

  if (!password) {
    errors.password = "Password is required"
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors })
  }

  // Construct the payload with the correct type
  const payload = { email, password }
  const response = await API.auth.loginRequest(payload, apiHelper)

  if (response.status === 200) {
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
        isVerified: response.data.isVerified,
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

export default function Login() {
  const actionData = useActionData<typeof action>()

  return <AuthForm type="login" actionData={actionData} />
}
