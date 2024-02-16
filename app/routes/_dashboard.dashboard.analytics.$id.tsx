import { json } from "@remix-run/node"
import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs
} from "@remix-run/node"
import { useEffect, useState } from "react"
import {
  useLoaderData,
  Form,
  useActionData,
  useParams,
  ShouldRevalidateFunction
} from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import dayjs from "dayjs"
import { apiHelper, dateHelper } from "~/utils/helpers"
import API from "~/utils/api"
import { userState } from "~/services/cookies.server"
import {
  TotalVisitor,
  TopFive,
  Counter,
  CalendarRangePicker,
  Button
} from "~/components/shared"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-analytics-title") }]
}

const getStatsQuery = ({ start, end }: { start: Date; end: Date }) => {
  return `start=${dateHelper.dateToUnixTimestamp(
    start
  )}&end=${dateHelper.dateToUnixTimestamp(end)}`
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const maxRange = 14
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const id = params.id || 0

  const start = dayjs().subtract(maxRange, "day").toDate()
  const end = dayjs().toDate()
  const query = getStatsQuery({ start, end })

  const response = await API.stats.getLinkStats(
    { token: user.token, query, id: +id },
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const id = params.id || 0

  const formData = await request.formData()
  const rangeData = formData.getAll("range[]") // Use getAll to get all values
  const start = `${rangeData[0]} 00:00:00`
  const end = `${rangeData[1]} 23:59:59`

  const query = getStatsQuery({
    start: dayjs(start).toDate(),
    end: dayjs(end).toDate()
  })

  const response = await API.stats.getLinkStats(
    { token: user.token, query, id: +id },
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
  const params = useParams()
  const linkId = params.id

  const [statsData, setStatsData] = useState(stats)

  useEffect(() => {
    if (actionData) {
      setStatsData(actionData.stats)
    }
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
      <div className=" bg-white rounded-md p-4">
        <Form
          method="POST"
          action={`/dashboard/analytics/${linkId}`}
          className=" flex gap-4 flex-col sm:flex-row"
        >
          <CalendarRangePicker maxRange={maxRange} name="range[]" />
          <Button
            type="submit"
            className="bg-primary text-white w-full sm:w-fit"
          >
            {t("apply")}
          </Button>
        </Form>
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-4 gap-4">
          {statsData.counters.map((detail) => (
            <div
              key={detail.title + detail.value}
              className=" bg-white p-4 rounded-md flex flex-row lg:flex-col gap-1 border shadow-md"
            >
              <h2 className="text-sm">{detail.title}:</h2>
              <p className="text-sm font-semibold">
                <Counter total={detail.value} />
              </p>
            </div>
          ))}
        </div>
        <TotalVisitor
          label="Total Visitor"
          labels={statsData.chart.labels}
          data={statsData.chart.data}
          title="Total Visitor"
        />
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {statsData.tables.map((table) => {
            return (
              <TopFive
                key={table.title}
                labels={table.labels}
                data={table.values}
                title={table.title}
                columnTitle={table.column}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
