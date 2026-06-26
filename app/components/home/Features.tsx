import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

import { Card } from "~/components/ui/card"

type FeatureProps = {
  title: string
  desc: string
  icon: string
}

function Feature({ title, desc, icon }: FeatureProps) {
  return (
    <Card
      elevation="raised"
      interactive
      className="flex items-start gap-4 p-5 text-fg transition-transform duration-200 hover:-translate-y-1"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-brand-subtle text-2xl text-brand-text">
        <Icon icon={icon} />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-fg">{title}</h3>
        <p className="text-sm text-fg-muted">{desc}</p>
      </div>
    </Card>
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
