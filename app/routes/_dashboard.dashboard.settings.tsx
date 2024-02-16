import type { MetaFunction } from "@remix-run/node"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-settings-title") }]
}

export default function DashboardSettings() {
  const { t } = useTranslation("dashboard")

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-md h-full mb-4">
        <Icon icon="line-md:cog-filled-loop" className="text-2xl sm:text-4xl" />
        <h1 className=" text-2xl sm:text-4xl font-semibold">{t("settings")}</h1>
      </div>
    </>
  )
}
