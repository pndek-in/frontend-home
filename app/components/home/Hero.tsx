import { useTranslation } from "react-i18next"
import { Form, useOutletContext } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { Icon } from "@iconify-icon/react"

import { Button, Input, UnclaimedLink } from "~/components/shared"
import { Badge } from "~/components/ui/badge"

type HeroProps = {
  isSuccess?: boolean
  linkData?: {
    id: number
    url: string
    path: string
  }
}

export default function Hero({ isSuccess, linkData }: HeroProps) {
  const { t } = useTranslation("home")
  const context = useOutletContext() as any
  const $homeCreateForm = useRef<HTMLFormElement>(null)

  useEffect(
    function resetFormOnSuccess() {
      if (isSuccess) {
        $homeCreateForm.current?.reset()
      }
    },
    [isSuccess]
  )

  const trustChips = [
    {
      icon: "material-symbols:share-reviews-outline-rounded",
      label: t("feature-1-title")
    },
    { icon: "material-symbols:bolt-rounded", label: t("feature-2-title") },
    {
      icon: "material-symbols:bar-chart-4-bars-rounded",
      label: t("feature-3-title")
    }
  ]

  return (
    <div className="relative isolate w-full overflow-hidden">
      {/* emerald brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-subtle), transparent)"
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px-60px-136px-80px)] w-full max-w-3xl flex-col items-center justify-center p-5 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-fg md:text-6xl">
          {t("hero-header")}
        </h1>
        <h2 className="mt-5 max-w-xl text-base font-medium text-fg-muted md:text-lg">
          {t("hero-subheader")}
        </h2>

        <div className="mt-9 w-full max-w-xl">
          {linkData?.id ? (
            <UnclaimedLink linkData={linkData} />
          ) : (
            <Form
              id="shorten-link-form"
              method="post"
              className="flex w-full flex-col"
              ref={$homeCreateForm}
              reloadDocument
              action={context?.isLoggedIn ? "/dashboard/links" : ""}
            >
              <div className="flex w-full rounded-card border border-line bg-surface p-2 shadow-token-lg">
                <Input
                  placeholder={t("long-link-placeholder", { ns: "common" })}
                  name="link"
                  variant="group"
                  className="border-none shadow-none"
                />
                <Button type="submit" name="intent" value="create" isGroup>
                  {t("shorten", { ns: "common" })}
                </Button>
              </div>
            </Form>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {trustChips.map((chip) => (
            <Badge key={chip.label} color="neutral" pill>
              <Icon icon={chip.icon} />
              {chip.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
