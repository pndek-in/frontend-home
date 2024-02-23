import { json } from "@remix-run/node"
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import { useActionData } from "@remix-run/react"

import { apiHelper } from "~/utils/helpers"
import API from "~/utils/api"
import { userState, globalToast } from "~/services/cookies.server"
import { Dashboard } from "~/components"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-settings-title") }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const headers = new Headers()

  const formData = await request.formData()
  const intent = formData.get("intent")

  const payload = {
    token: user.token
  }
  let telegramToken = ""
  let isEmailSent = false

  if (intent === "generate-telegram-token") {
    const response = await API.auth.generateTelegramToken(payload, apiHelper)
    telegramToken = response.data.token
  } else if (intent === "request-verification-email") {
    const response = await API.auth.requestVerificationEmail(payload, apiHelper)

    if (response.status === 200) {
      isEmailSent = true

      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: "Email sent!",
          type: "success"
        })
      )
    } else {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: "Failed to send email!",
          type: "error"
        })
      )
    }
  }

  return json({ telegramToken, isEmailSent }, { headers })
}

export default function DashboardSettings() {
  const { t } = useTranslation("dashboard")
  const actionData = useActionData<typeof action>()

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-md h-full mb-4">
        <Icon icon="line-md:cog-filled-loop" className="text-2xl sm:text-4xl" />
        <h1 className=" text-2xl sm:text-4xl font-semibold">{t("settings")}</h1>
      </div>

      <div className=" bg-white rounded-md p-4">
        <Dashboard.Setting.UserSetting isEmailSent={actionData?.isEmailSent} />
        <Dashboard.Setting.TelegramSetting token={actionData?.telegramToken} />
      </div>
    </>
  )
}
