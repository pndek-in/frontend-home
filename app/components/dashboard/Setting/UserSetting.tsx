import { Form, useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { Button } from "~/components/shared"

type UserSettingProps = {
  isEmailSent?: boolean
}

export default function UserSetting({ isEmailSent }: UserSettingProps) {
  const context = useOutletContext() as any
  const { t } = useTranslation("dashboard")

  return (
    <div className=" bg-white rounded-md p-4 space-y-4">
      <h2 className=" text-xl sm:text-2xl font-semibold">User Setting</h2>
      <hr className=" border-gray-400" />
      <Form
        method="post"
        action="/dashboard/settings"
        className=" grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <p className=" font-semibold">{t("request-verification-email")}:</p>
        <div className=" flex justify-end">
          <Button
            type="submit"
            className=" bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            disabled={context.user?.isVerified || isEmailSent}
            name="intent"
            value="request-verification-email"
          >
            {isEmailSent ? t("email-sent") : t("send-email")}
          </Button>
        </div>
      </Form>
    </div>
  )
}
