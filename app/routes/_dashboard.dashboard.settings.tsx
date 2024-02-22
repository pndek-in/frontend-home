import { json } from "@remix-run/node"
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import { useActionData, useOutletContext } from "@remix-run/react"

import { apiHelper } from "~/utils/helpers"
import API from "~/utils/api"
import { userState } from "~/services/cookies.server"
import { Dashboard } from "~/components"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-settings-title") }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}

  const payload = {
    token: user.token
  }

  const response = await API.auth.generateTelegramToken(payload, apiHelper)
  const telegramToken = response.data.token

  return json({ telegramToken })
}

export default function DashboardSettings() {
  const { t } = useTranslation("dashboard")
  const actionData = useActionData<typeof action>()
  const context = useOutletContext() as any

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-md h-full mb-4">
        <Icon icon="line-md:cog-filled-loop" className="text-2xl sm:text-4xl" />
        <h1 className=" text-2xl sm:text-4xl font-semibold">{t("settings")}</h1>
      </div>

      <div className=" bg-white rounded-md p-4">
        <Dashboard.Setting.TelegramSetting token={actionData?.telegramToken} />
      </div>
    </>
  )
}
