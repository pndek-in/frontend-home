import { json, redirect } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

import { userState } from "~/services/cookies.server"
import { Link } from "~/components/shared"
import { dashboardMenu } from "~/utils/constants"

export const handle = {
  i18n: ["dashboard", "meta"]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}

  if (!user.token) {
    return redirect("/login")
  }

  return json({ user })
}

export default function Index() {
  const { t } = useTranslation()
  const { user } = useLoaderData<typeof loader>()
  const context = { user }

  return (
    <main className=" min-h-[calc(100vh-64px-60px)] w-full lg:max-w-7xl mx-auto p-4 flex space-x-0 sm:space-x-4">
      <div className=" hidden sm:flex sticky top-[calc(16px+64px)] bg-white h-min w-96 rounded-md p-4">
        <ul className=" space-y-4">
          {dashboardMenu.map((menu, i) => (
            <li key={i} className="flex items-center space-x-2">
              <Icon icon={menu.icon} />
              <Link to={menu.url} className=" font-semibold">
                <span>{t(menu.name, { ns: "common" })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" w-full h-min">
        {!user?.isVerified && (
          <div className=" bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
            <div className=" flex items-center">
              <Icon
                icon="line-md:alert-circle"
                className=" text-yellow-400 text-lg font-semibold"
              />
              <div className=" ml-3">
                <p className=" text-sm text-yellow-700">
                  {t("banner-not-verified", { ns: "dashboard" })}
                </p>
              </div>
            </div>
          </div>
        )}
        <Outlet context={context} />
      </div>
    </main>
  )
}
