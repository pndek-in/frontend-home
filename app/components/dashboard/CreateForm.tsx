import { Form, useOutletContext } from "@remix-run/react"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "antd"

import { Input, Button, Divider, CalendarTimePicker } from "~/components/shared"

type CreateFormProps = {
  isReset?: boolean
}

export default function CreateForm({ isReset }: CreateFormProps) {
  const { t } = useTranslation("dashboard")
  const [isAddConfigShown, setIsAddConfigShown] = useState(false)
  const context = useOutletContext() as any

  const $form = useRef<HTMLFormElement>(null)

  useEffect(
    function resetFormOnSuccess() {
      if (isReset) {
        setIsAddConfigShown(false)
        $form.current?.reset()
      }
    },
    [isReset]
  )

  const handleAddConfig = () => {
    setIsAddConfigShown(!isAddConfigShown)
  }

  const DividerWrapper = ({ children }: { children: React.ReactNode }) => {
    return context.user?.isVerified ? (
      <>{children}</>
    ) : (
      <Tooltip title={t("tooltip-need-verify-first")}>{children}</Tooltip>
    )
  }

  return (
    <Form
      method="post"
      action="/dashboard/links"
      className=" flex flex-col p-4 bg-white rounded-md"
      ref={$form}
    >
      <div className=" flex">
        <Input
          placeholder={t("long-link-placeholder", { ns: "common" })}
          name="link"
          variant="group"
        />
        <Button type="submit" isGroup name="intent" value="create">
          {t("shorten", { ns: "common" })}
        </Button>
      </div>

      <Divider className="mt-4">
        <DividerWrapper>
          <div className=" flex mx-4">
            <input
              type="checkbox"
              name="addConfig"
              id="addConfig"
              onChange={handleAddConfig}
              className=" cursor-pointer"
              disabled={!context?.user?.isVerified}
            />
            <label htmlFor="addConfig" className="pl-2 cursor-pointer">
              {t("additional-config")}
            </label>
          </div>
        </DividerWrapper>
      </Divider>

      {isAddConfigShown ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <span>
            <Input
              placeholder={t("placeholder-input-url-description")}
              name="description"
            />
          </span>
          <CalendarTimePicker
            placeholder={t("placeholder-input-url-expired-at")}
            name="expiredAt"
          />
          <Tooltip
            placement="topLeft"
            title={t("tooltip-input-url-secret-code")}
          >
            <span>
              <Input
                placeholder={t("placeholder-input-url-secret-code")}
                name="secretCode"
                type="password"
              />
            </span>
          </Tooltip>
        </div>
      ) : null}
    </Form>
  )
}
