import { json, redirect } from "@remix-run/node"
import type {
  ActionFunctionArgs,
  MetaFunction,
  LoaderFunctionArgs
} from "@remix-run/node"
import {
  useLoaderData,
  useActionData,
  useOutletContext
} from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { isUrlValid } from "~/utils/helpers"
import { unclaimedLink, globalToast } from "~/services/cookies.server"
import { GoogleLogin } from "~/components/shared"
import { Home } from "~/components"
import { createLinkWithoutAuth } from "~/server/services/link.server"
import { getHomeStats } from "~/server/services/stats.server"

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
  const headers = new Headers()
  const formData = await request.formData()
  const link = String(formData.get("link"))
  const intent = String(formData.get("intent"))

  let isSuccess = false

  if (intent === "create") {
    if (!link) {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: "Link is required!", type: "error" })
      )
      return redirect("/", { headers })
    }

    if (!isUrlValid(link)) {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: "Link is not valid!", type: "error" })
      )
      return redirect("/", { headers })
    }

    try {
      const response = await createLinkWithoutAuth({ url: link })
      isSuccess = true

      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: response.message, type: "success" })
      )
      headers.append(
        "Set-Cookie",
        await unclaimedLink.serialize({
          id: response.data.linkId,
          path: response.data.path,
          url: response.data.url
        })
      )

      return redirect("/", { headers })
    } catch (err: any) {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: err.message, type: "error" })
      )
    }
  }

  return json({ isSuccess }, { headers })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const linkData = (await unclaimedLink.parse(request.headers.get("Cookie"))) || {}

  let stats = { totalLinks: 0, totalClicks: 0, totalUsers: 0 }
  try {
    const response = await getHomeStats()
    stats = response.data || stats
  } catch {}

  return json({ googleClientId, stats, linkData })
}

export default function Index() {
  const { googleClientId = "", stats, linkData } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const context = useOutletContext() as any

  return (
    <main className=" min-h-[calc(100vh-64px-60px)]">
      {!context?.isLoggedIn && (
        <GoogleLogin isPrompt googleClientId={googleClientId} />
      )}
      <Home.Hero isSuccess={actionData?.isSuccess} linkData={linkData} />
      <Home.Features />
      <Home.TelegramExample />
      <Home.Statistic stats={stats} />
    </main>
  )
}
