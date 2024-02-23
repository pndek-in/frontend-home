import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "@remix-run/react"

import { userState } from "~/services/cookies.server"
import { GoogleLogin, Divider } from "~/components/shared"

export const handle = {
  i18n: ["auth"]
}

export async function loader({ request }: ActionFunctionArgs) {
  const user = await userState.parse(request.headers.get("Cookie")) || {}
  if (user.token) {
    return redirect("/dashboard")
  }
  const googleClientId = process.env.GOOGLE_CLIENT_ID

  return json({ googleClientId })
}

export default function Index() {
  const { googleClientId = "" } = useLoaderData<typeof loader>()
  const { t } = useTranslation("auth")

  return (
    <main className=" min-h-[calc(100vh-64px-60px)] flex items-center p-4">
      <div className=" w-full sm:w-[640px] rounded-md bg-gray-50 dark:bg-slate-200 mx-auto p-4 sm:p-16">
        <Outlet />
        <Divider text={t("or-continue-with")} className="my-4" />
        <div className=" flex justify-center">
          <GoogleLogin isButton googleClientId={googleClientId} />
        </div>
      </div>
    </main>
  )
}