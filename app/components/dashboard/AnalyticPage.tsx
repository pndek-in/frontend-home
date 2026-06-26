import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import {
  TotalVisitor,
  TopFive,
  Counter,
  CalendarRangePicker,
  Button
} from "~/components/shared"
import { Stat } from "~/components/ui/stat"

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
  const isVerified = context.user.isVerified

  const masonryLists = {
    left: statsData.tables.filter((_: any, i: number) => i % 2 === 0),
    right: statsData.tables.filter((_: any, i: number) => i % 2 !== 0)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-line bg-surface p-4 shadow-token">
        <Form
          method="post"
          action={action}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <CalendarRangePicker maxRange={maxRange} name="range[]" />
          <Button type="submit" className="w-full sm:w-fit">
            {t("apply")}
          </Button>
        </Form>
      </div>

      <Stat.Group className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.counters.map((detail) => (
          <Stat
            key={detail.title + detail.value}
            label={t(detail.title)}
            value={
              <span className={isVerified ? "" : "select-none blur-sm"}>
                <Counter total={isVerified ? detail.value : 0} />
              </span>
            }
          />
        ))}
      </Stat.Group>

      <TotalVisitor
        label={t("total-visitor")}
        labels={statsData.chart.labels}
        data={statsData.chart.data}
        title={t("total-visitor")}
        isVerified={isVerified}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="hidden flex-col space-y-4 lg:flex">
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
        <div className="hidden flex-col space-y-4 lg:flex">
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
        <div className="flex flex-col space-y-4 lg:hidden">
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
