import { useTranslation } from "react-i18next"

import { Counter } from "~/components/shared"

type CounterContentProps = {
  count: number
  title: string
}

function CounterContent({ count, title }: CounterContentProps) {
  return (
    <div className="p-4 text-center">
      <h3 className=" font-semibold text-gray-800 dark:text-gray-200 text-3xl sm:text-5xl mb-2">
        <Counter total={count} />
      </h3>
      <p className=" text-gray-600 dark:text-gray-300 font-semibold text-lg sm:text-xl">
        {title}
      </p>
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
    <div className=" flex flex-col sm:flex-row justify-center sm:space-x-10 md:space-x-32 py-20 px-5 mx-auto max-w-[900px] w-full">
      {counters.map((counter, index) => (
        <CounterContent key={index} {...counter} />
      ))}
    </div>
  )
}
