import { useState, useEffect } from "react"
import { useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"

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
    <div className=" h-min bg-white rounded-md p-4 border shadow-md">
      <h2 className=" text-center font-semibold text-lg mb-4">{t(title)}</h2>
      <table className=" h-min w-full">
        <thead className=" border">
          <tr>
            <th className="text-left px-3 py-2">{t(columnTitle)}</th>
            <th className="text-left px-3 py-2">{t("total")}</th>
          </tr>
        </thead>
        <tbody className="">
          {labels.map((label, index) => (
            <tr
              key={index}
              className={`${
                context.user.isVerified ? "" : " blur-sm select-none"
              } border hover:bg-slate-300`}
            >
              <td className=" text-left px-3 py-2">
                {context.user.isVerified ? t(label) : "Lorem Ipsum"}
              </td>
              <td className=" text-left px-3 py-2">
                {context.user.isVerified ? data[index] : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
