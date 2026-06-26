import { Icon } from "@iconify-icon/react"

type PageHeaderProps = {
  icon: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  action
}: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-4 shadow-token sm:p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-brand-subtle text-2xl text-brand-text">
          <Icon icon={icon} />
        </span>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-normal text-fg-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
