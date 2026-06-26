import { useTranslation } from "react-i18next"

import { Counter } from "~/components/shared"

type CounterContentProps = {
  count: number
  title: string
}

function CounterContent({ count, title }: CounterContentProps) {
  return (
    <div className="flex-1 p-4 text-center">
      <h3 className="mb-2 text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
        <Counter total={count} />
      </h3>
      <p className="text-base font-medium text-fg-muted sm:text-lg">{title}</p>
    </div>
  )
}

type StatisticProps = {
  stats: {
    totalUser: number
    totalLink: number
    totalClick: number
  }
}

export default function Statistic({ stats }: StatisticProps) {
  const { t } = useTranslation("home")
  const counters = [
    {
      title: t("total-link-created"),
      count: stats.totalLink
    },
    {
      title: t("total-account-created"),
      count: stats.totalUser
    },
    {
      title: t("total-link-visited"),
      count: stats.totalClick
    }
  ]

  return (
    <div className="px-5 py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col divide-y divide-line rounded-card border border-line bg-subtle p-6 sm:flex-row sm:divide-x sm:divide-y-0">
        {counters.map((counter, index) => (
          <CounterContent key={index} {...counter} />
        ))}
      </div>
    </div>
  )
}
