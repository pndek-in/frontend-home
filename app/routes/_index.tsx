import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import {
  useLoaderData,
  useActionData,
  useOutletContext
} from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { apiHelper } from "~/utils/helpers"
import API from "~/utils/api"
import { REGEX } from "~/utils/constants"
import { GoogleLogin } from "~/components/shared"
import { Home } from "~/components"

type ActionError = {
  link?: string
}

export const handle = {
  i18n: ["home", "meta"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-home-title") },
    { name: "description", content: t("meta-home-desc") }
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const payload = Object.fromEntries(formData)
  const link = String(formData.get("link"))

  const errors: ActionError = {}

  // link is must valid url
  if (!REGEX.VALID_URL_REGEX.test(link)) {
    errors.link = "Link is not valid URL"
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors })
  }

  return redirect("/")
}

export async function loader() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const response = await API.stats.getHomeStats(apiHelper)
  const stats = response.data || {
    totalLinks: 0,
    totalClicks: 0,
    totalUsers: 0
  }

  return json({ googleClientId, stats })
}

export default function Index() {
  const { googleClientId = "", stats } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const context = useOutletContext() as any

  return (
    <main className=" min-h-[calc(100vh-64px-60px)]">
      {!context?.isLoggedIn && (
        <GoogleLogin isPrompt googleClientId={googleClientId} />
      )}
      <Home.Hero actionData={actionData} />
      <Home.Features />
      <Home.TelegramExample />
      <Home.Statistic stats={stats} />
    </main>
  )
}
