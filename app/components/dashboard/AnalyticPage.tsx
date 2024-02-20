import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import {
  TotalVisitor,
  TopFive,
  Counter,
  CalendarRangePicker,
  Button
} from "~/components/shared"

type AnalyticPageProps = {
  action: string
  maxRange: number
  statsData: {
    counters: { title: string; value: number }[]
    chart: { labels: string[]; data: number[] }
    tables: {
      title: string
      labels: string[]
      values: number[]
      column: string
    }[]
  }
}

export default function AnalyticPage({
  action,
  maxRange,
  statsData
}: AnalyticPageProps) {
  const { t } = useTranslation("dashboard")
  const context = useOutletContext() as any

  const masonryLists = {
    left: statsData.tables.filter((_: any, i: number) => i % 2 === 0),
    right: statsData.tables.filter((_: any, i: number) => i % 2 !== 0)
  }

  return (
    <div className=" bg-white rounded-md p-4">
      <Form
        method="POST"
        action={action}
        className=" flex gap-4 flex-col sm:flex-row"
      >
        <CalendarRangePicker maxRange={maxRange} name="range[]" />
        <Button type="submit" className="bg-primary text-white w-full sm:w-fit">
          {t("apply")}
        </Button>
      </Form>
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-4 gap-4">
        {statsData.counters.map((detail) => (
          <div
            key={detail.title + detail.value}
            className=" bg-white p-4 rounded-md flex flex-row lg:flex-col gap-1 border shadow-md"
          >
            <h2 className="text-sm">{t(detail.title)}:</h2>
            <p
              className={`${
                context.user.isVerified ? "" : " blur-sm select-none"
              } text-sm font-semibold`}
            >
              <Counter total={context.user.isVerified ? detail.value : 0} />
            </p>
          </div>
        ))}
      </div>
      <TotalVisitor
        label={t("total-visitor")}
        labels={statsData.chart.labels}
        data={statsData.chart.data}
        title={t("total-visitor")}
        isVerified={context.user.isVerified}
      />
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="hidden lg:flex flex-col space-y-4">
          {masonryLists.left.map((data: any) => (
            <TopFive
              key={data.title}
              labels={data.labels}
              data={data.values}
              title={data.title}
              columnTitle={data.column}
            />
          ))}
        </div>
        <div className="hidden lg:flex flex-col space-y-4">
          {masonryLists.right.map((data: any) => (
            <TopFive
              key={data.title}
              labels={data.labels}
              data={data.values}
              title={data.title}
              columnTitle={data.column}
            />
          ))}
        </div>
        <div className="lg:hidden flex flex-col space-y-4">
          {statsData.tables.map((data: any) => (
            <TopFive
              key={data.title}
              labels={data.labels}
              data={data.values}
              title={data.title}
              columnTitle={data.column}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
