import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import { toast } from "react-toastify"

import { Button } from "~/components/shared"
import { Tooltip } from "~/components/ui/tooltip"
import { IconButton } from "~/components/ui/icon-button"

type TelegramSettingProps = {
  token?: string
}

export default function TelegramSetting({ token }: TelegramSettingProps) {
  const context = useOutletContext() as any
  const { t } = useTranslation("dashboard")
  const isVerified = context.user?.isVerified

  const copyToken = () => {
    navigator.clipboard.writeText(token || "")
    toast.success(t("copied"), {
      toastId: "copy-to-clipboard",
      position: "top-center",
      autoClose: 1000
    })
  }

  const GenerateButton = (
    <Form method="post" action="/dashboard/settings">
      <Button
        type="submit"
        name="intent"
        value="generate-telegram-token"
        disabled={!isVerified}
        isBlock
      >
        <Icon icon="mdi:robot-outline" className="mr-1" />
        {t("generate")}
      </Button>
    </Form>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-card border border-line bg-app p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md font-semibold text-fg">
          {t("generate-token-telegram")}
        </p>
        {token ? (
          <div className="flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2">
            <span className="break-all font-mono text-sm text-fg">{token}</span>
            <Tooltip content={t("copied")}>
              <IconButton aria-label={t("copied")} onClick={copyToken}>
                <Icon icon="line-md:clipboard" />
              </IconButton>
            </Tooltip>
          </div>
        ) : isVerified ? (
          GenerateButton
        ) : (
          <Tooltip content={t("tooltip-need-verify-first")}>
            {GenerateButton}
          </Tooltip>
        )}
      </div>
    </div>
  )
}
