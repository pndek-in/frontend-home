import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"

import { Button } from "~/components/shared"
import { Badge } from "~/components/ui/badge"

type UserSettingProps = {
  isEmailSent?: boolean
}

export default function UserSetting({ isEmailSent }: UserSettingProps) {
  const context = useOutletContext() as any
  const { t } = useTranslation("dashboard")
  const isVerified = context.user?.isVerified

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-card border border-line bg-app p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-fg">
              {t("request-verification-email")}
            </p>
            {isVerified ? (
              <Badge color="success" pill>
                <Icon icon="mdi:check-decagram" /> Verified
              </Badge>
            ) : (
              <Badge color="warning" pill>
                Unverified
              </Badge>
            )}
          </div>
        </div>
        <Form method="post" action="/dashboard/settings">
          <Button
            type="submit"
            variant="secondary"
            disabled={isVerified || isEmailSent}
            name="intent"
            value="request-verification-email"
          >
            {isEmailSent ? t("email-sent") : t("send-email")}
          </Button>
        </Form>
      </div>
    </div>
  )
}
