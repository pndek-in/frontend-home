import { json } from "@remix-run/node"
import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs
} from "@remix-run/node"
import { useEffect, useState } from "react"
import {
  useLoaderData,
  useActionData,
  useParams,
  ShouldRevalidateFunction
} from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import dayjs from "dayjs"

import { dateHelper } from "~/utils/helpers"
import { userState } from "~/services/cookies.server"
import { Dashboard } from "~/components"
import { authenticate } from "~/server/auth/authenticate.server"
import { authorizeLink } from "~/server/auth/authorize-link.server"
import { getLinkStats } from "~/server/services/stats.server"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-analytics-title") }]
}

const emptyStats = { counters: [], chart: { labels: [], data: [] }, tables: [], link: { path: "" } }

export async function loader({ request, params }: LoaderFunctionArgs) {
  const maxRange = 14
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const id = Number(params.id)
  const start = dayjs().subtract(maxRange, "day").toDate()
  const end = dayjs().toDate()

  let stats = emptyStats
  try {
    const userData = await authenticate(user.token)
    await authorizeLink(id, userData.userId)
    const response = await getLinkStats(
      id,
      dateHelper.dateToUnixTimestamp(start),
      dateHelper.dateToUnixTimestamp(end)
    )
    stats = response.data || emptyStats
  } catch {}

  return json({ stats, maxRange })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const id = Number(params.id)
  const formData = await request.formData()
  const rangeData = formData.getAll("range[]")
  const startDate = dateHelper.getEnglishDate(rangeData[0] as string)
  const endDate = dateHelper.getEnglishDate(rangeData[1] as string)

  const startUnix = dateHelper.dateToUnixTimestamp(
    dayjs(`${startDate} 00:00:00`).toDate()
  )
  const endUnix = dateHelper.dateToUnixTimestamp(
    dayjs(`${endDate} 23:59:59`).toDate()
  )

  let stats = emptyStats
  try {
    const userData = await authenticate(user.token)
    await authorizeLink(id, userData.userId)
    const response = await getLinkStats(id, startUnix, endUnix)
    stats = response.data || emptyStats
  } catch {}

  return json({ stats })
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  defaultShouldRevalidate
}) => {
  if (actionResult?.stats) return false
  return defaultShouldRevalidate
}

export default function DashboardAnalytics() {
  const { t } = useTranslation("dashboard")
  const { maxRange, stats } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const params = useParams()
  const linkId = params.id

  const [statsData, setStatsData] = useState(stats)

  useEffect(() => {
    if (actionData) setStatsData(actionData.stats)
  }, [actionData])

  return (
    <>
      <div className="flex flex-col bg-white p-4 rounded-md h-full mb-4">
        <div className="flex items-center space-x-4">
          <Icon
            icon="line-md:document-report"
            className="text-2xl sm:text-4xl"
          />
          <h1 className=" text-2xl sm:text-4xl font-semibold">
            {t("analytics")}
          </h1>
        </div>
        <h3 className="text-sm text-gray-500 pl-1">
          pndek.in/{stats.link.path}
        </h3>
      </div>
      <Dashboard.AnalyticPage
        action={`/dashboard/analytics/${linkId}`}
        maxRange={maxRange}
        statsData={statsData}
      />
    </>
  )
}
