import { json } from "@remix-run/node"
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useActionData } from "@remix-run/react"

import { userState, globalToast } from "~/services/cookies.server"
import { Dashboard } from "~/components"
import { Tabs } from "~/components/ui/tabs"
import { Card } from "~/components/ui/card"
import PageHeader from "~/components/dashboard/PageHeader"
import { authenticate } from "~/server/auth/authenticate.server"
import {
  generateTelegramToken,
  requestVerifEmail
} from "~/server/services/auth.server"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-settings-title") }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const headers = new Headers()
  const formData = await request.formData()
  const intent = formData.get("intent")

  let telegramToken = ""
  let isEmailSent = false

  try {
    const userData = await authenticate(user.token)

    if (intent === "generate-telegram-token") {
      const response = generateTelegramToken(userData)
      telegramToken = response.data.token
    } else if (intent === "request-verification-email") {
      await requestVerifEmail(userData)
      isEmailSent = true

      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: "Email sent!", type: "success" })
      )
    }
  } catch {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({
        content: "Failed to send email!",
        type: "error"
      })
    )
  }

  return json({ telegramToken, isEmailSent }, { headers })
}

export default function DashboardSettings() {
  const { t } = useTranslation("dashboard")
  const actionData = useActionData<typeof action>()
  const [tab, setTab] = useState("account")

  return (
    <>
      <PageHeader
        icon="line-md:cog-filled-loop"
        title={t("settings")}
        subtitle={t("page-settings-subtitle")}
      />

      <Card elevation="raised" className="!overflow-visible">
        <Card.Body className="space-y-5">
          <Tabs
            variant="pill"
            value={tab}
            onChange={setTab}
            items={[
              { value: "account", label: t("user-setting") },
              { value: "telegram", label: t("telegram-setting") }
            ]}
          />
          {tab === "account" ? (
            <Dashboard.Setting.UserSetting
              isEmailSent={actionData?.isEmailSent}
            />
          ) : (
            <Dashboard.Setting.TelegramSetting
              token={actionData?.telegramToken}
            />
          )}
        </Card.Body>
      </Card>
    </>
  )
}
