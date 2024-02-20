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
  ShouldRevalidateFunction
} from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import dayjs from "dayjs"
import { apiHelper, dateHelper } from "~/utils/helpers"
import API from "~/utils/api"
import { userState } from "~/services/cookies.server"
import { Dashboard } from "~/components"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-analytics-title") }]
}

const getStatsQuery = ({ start, end }: { start: Date; end: Date }) => {
  return `start=${dateHelper.dateToUnixTimestamp(
    start
  )}&end=${dateHelper.dateToUnixTimestamp(end)}`
}

export async function loader({ request }: LoaderFunctionArgs) {
  const maxRange = 14
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const start = dayjs().subtract(maxRange, "day").toDate()
  const end = dayjs().toDate()
  const query = getStatsQuery({ start, end })

  const response = await API.stats.getUserStats(
    { token: user.token, query },
    apiHelper
  )

  const stats = response.data || {
    counters: [],
    chart: {
      labels: [],
      data: []
    },
    tables: []
  }

  return json({ stats, maxRange })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}

  const formData = await request.formData()
  const rangeData = formData.getAll("range[]") // Use getAll to get all values
  const start = `${rangeData[0]} 00:00:00`
  const end = `${rangeData[1]} 23:59:59`

  const query = getStatsQuery({
    start: dayjs(start).toDate(),
    end: dayjs(end).toDate()
  })

  const response = await API.stats.getUserStats(
    { token: user.token, query },
    apiHelper
  )

  const stats = response.data || {
    counters: [],
    chart: {
      labels: [],
      data: []
    },
    tables: []
  }

  return json({ stats })
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  defaultShouldRevalidate
}) => {
  if (actionResult?.stats) {
    return false
  }
  return defaultShouldRevalidate
}

export default function DashboardAnalytics() {
  const { t } = useTranslation("dashboard")
  const { maxRange, stats } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const [statsData, setStatsData] = useState(stats)

  useEffect(() => {
    if (actionData) {
      setStatsData(actionData.stats)
    }
  }, [actionData])

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-md h-full mb-4">
        <Icon icon="line-md:document-report" className="text-2xl sm:text-4xl" />
        <h1 className=" text-2xl sm:text-4xl font-semibold">
          {t("analytics")}
        </h1>
      </div>
      <Dashboard.AnalyticPage
        action="/dashboard/analytics"
        maxRange={maxRange}
        statsData={statsData}
      />
    </>
  )
}
