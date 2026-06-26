import { useState, useEffect } from "react"
import { useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { Card } from "~/components/ui/card"

type DashboardTopFiveProps = {
  labels: string[]
  title: string
  data: number[]
  columnTitle: string
}

export default function DashboardTopFive({
  labels,
  title,
  data,
  columnTitle
}: DashboardTopFiveProps) {
  const { t } = useTranslation("dashboard")
  const context = useOutletContext() as any
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Card elevation="raised" className="h-min">
      <Card.Header title={t(title)} />
      <Card.Body className="pt-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-fg-muted">
              <th className="px-3 py-2 text-left font-semibold">
                {t(columnTitle)}
              </th>
              <th className="px-3 py-2 text-right font-semibold">
                {t("total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr
                key={index}
                className={`border-b border-line-subtle text-fg transition-colors hover:bg-surface-hover ${
                  context.user.isVerified ? "" : "select-none blur-sm"
                }`}
              >
                <td className="px-3 py-2 text-left">
                  {context.user.isVerified ? t(label) : "Lorem Ipsum"}
                </td>
                <td className="px-3 py-2 text-right font-semibold">
                  {context.user.isVerified ? data[index] : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  )
}
