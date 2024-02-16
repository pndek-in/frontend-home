import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

type FeatureProps = {
  title: string
  desc: string
  icon: string
}

function Feature({ title, desc, icon }: FeatureProps) {
  return (
    <div className=" shadow-xl rounded-md bg-white dark:bg-slate-700 p-4 flex items-center space-x-4">
      <Icon
        icon={icon}
        className=" text-4xl text-gray-800 dark:text-gray-200"
      />
      <div className=" flex flex-col">
        <h3 className=" font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <p className=" text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
      </div>
    </div>
  )
}

export default function Features() {
  const { t } = useTranslation("home")
  const features = [
    {
      title: t("feature-1-title"),
      desc: t("feature-1-desc"),
      icon: "material-symbols:share-reviews-outline-rounded"
    },
    {
      title: t("feature-2-title"),
      desc: t("feature-2-desc"),
      icon: "material-symbols:important-devices-outline-rounded"
    },
    {
      title: t("feature-3-title"),
      desc: t("feature-3-desc"),
      icon: "material-symbols:bar-chart-4-bars-rounded"
    }
  ]

  return (
    <div className="xl:max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 md:space-x-10 space-y-3 md:space-y-0 mb-40 min-h-[136px] px-5">
      {features.map((feature, index) => (
        <Feature key={index} {...feature} />
      ))}
    </div>
  )
}
