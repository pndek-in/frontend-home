import { json, redirect } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

import { userState } from "~/services/cookies.server"
import { Link } from "~/components/shared"
import { Alert } from "~/components/ui/alert"
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
  const { pathname } = useLocation()
  const context = { user }

  const isActive = (url: string) => {
    const base = url.split("?")[0]
    return pathname === base || pathname.startsWith(`${base}/`)
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px-60px)] w-full gap-0 p-4 sm:gap-6 lg:max-w-7xl">
      {/* Sidebar */}
      <aside className="sticky top-[calc(16px+64px)] hidden h-min w-64 shrink-0 flex-col gap-1 rounded-card border border-line bg-surface p-3 shadow-token sm:flex">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          {t("dashboard", { ns: "common" })}
        </p>
        <nav className="flex flex-col gap-1">
          {dashboardMenu.map((menu, i) => {
            const active = isActive(menu.url)
            return (
              <Link
                key={i}
                to={menu.url}
                className={`group flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-subtle text-brand-text"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                }`}
              >
                <Icon
                  icon={menu.icon}
                  className={`text-xl ${
                    active ? "text-brand-text" : "text-fg-subtle"
                  }`}
                />
                <span>{t(menu.name, { ns: "common" })}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="h-min w-full min-w-0">
        {/* Mobile nav */}
        <nav className="mb-4 flex gap-2 overflow-x-auto rounded-card border border-line bg-surface p-2 shadow-token sm:hidden">
          {dashboardMenu.map((menu, i) => {
            const active = isActive(menu.url)
            return (
              <Link
                key={i}
                to={menu.url}
                className={`flex shrink-0 items-center gap-2 rounded-control px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand-subtle text-brand-text"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                <Icon icon={menu.icon} className="text-lg" />
                <span>{t(menu.name, { ns: "common" })}</span>
              </Link>
            )
          })}
        </nav>

        {!user?.isVerified && (
          <Alert tone="warning" className="mb-4">
            {t("banner-not-verified", { ns: "common" })}
          </Alert>
        )}
        <Outlet context={context} />
      </div>
    </main>
  )
}
