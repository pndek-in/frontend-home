import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import { toast } from "react-toastify"
import { Tooltip } from "antd"

import { Button } from "~/components/shared"

type TelegramSettingProps = {
  token?: string
}

export default function TelegramSetting({ token }: TelegramSettingProps) {
  const context = useOutletContext() as any
  const { t } = useTranslation("dashboard")

  const copyToken = () => {
    navigator.clipboard.writeText(token || "")
    toast.success("Copied to clipboard", {
      toastId: "copy-to-clipboard",
      position: "top-center",
      autoClose: 1000
    })
  }

  const GenerateWrapper = ({ children }: { children: React.ReactNode }) => {
    return context.user?.isVerified ? (
      <>{children}</>
    ) : (
      <Tooltip title={t("tooltip-need-verify-first")}>{children}</Tooltip>
    )
  }

  return (
    <div className=" bg-white rounded-md p-4 space-y-4">
      <h2 className=" text-xl sm:text-2xl font-semibold">Telegram Setting</h2>
      <hr className=" border-gray-400" />
      <Form
        method="post"
        action="/dashboard/settings"
        className=" grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <p className=" font-semibold">{t("generate-token-telegram")}:</p>
        {token ? (
          <div>
            <p className=" break-all">
              {token}
              <span>
                <button onClick={copyToken}>
                  <Icon
                    icon="line-md:clipboard"
                    className="text-xl ml-2 -mb-1"
                  />
                </button>
              </span>
            </p>
          </div>
        ) : (
          <div className=" flex justify-end">
            <GenerateWrapper>
              <Button
                id=" generate-token-btn-desktop"
                type="submit"
                className=" hidden sm:flex"
                name="intent"
                value="generate-telegram-token"
                disabled={!context.user?.isVerified}
              >
                {t("generate")}
              </Button>
              <Button
                id=" generate-token-btn-mobile"
                type="submit"
                className=" flex sm:hidden"
                name="intent"
                value="generate-telegram-token"
                isBlock
                disabled={!context.user?.isVerified}
              >
                {t("generate")}
              </Button>
            </GenerateWrapper>
          </div>
        )}
      </Form>
    </div>
  )
}
