import { Form, useOutletContext } from "@remix-run/react"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import { Input, Button, CalendarTimePicker } from "~/components/shared"
import { Field } from "~/components/ui/field"
import { Tooltip } from "~/components/ui/tooltip"
import { Checkbox } from "~/components/ui/checkbox"

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

  const ConfigToggle = (
    <Checkbox
      name="addConfig"
      id="addConfig"
      onChange={handleAddConfig}
      disabled={!context?.user?.isVerified}
      checked={isAddConfigShown}
      label={t("additional-config")}
    />
  )

  return (
    <Form
      method="post"
      action="/dashboard/links"
      className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 shadow-token sm:p-5"
      ref={$form}
    >
      <div className="flex w-full rounded-card border border-line bg-app p-2">
        <Input
          placeholder={t("long-link-placeholder", { ns: "common" })}
          name="link"
          variant="group"
          className="border-none shadow-none"
        />
        <Button type="submit" isGroup name="intent" value="create">
          {t("shorten", { ns: "common" })}
        </Button>
      </div>

      <div className="flex items-center">
        {context.user?.isVerified ? (
          ConfigToggle
        ) : (
          <Tooltip content={t("tooltip-need-verify-first")}>
            {ConfigToggle}
          </Tooltip>
        )}
      </div>

      {isAddConfigShown ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("description")}>
            <Input
              placeholder={t("placeholder-input-url-description")}
              name="description"
            />
          </Field>
          <Field label={t("expires")}>
            <CalendarTimePicker
              placeholder={t("placeholder-input-url-expired-at")}
              name="expiredAt"
            />
          </Field>
          <Field
            label={t("secret-code")}
            hint={t("tooltip-input-url-secret-code")}
            className="sm:col-span-2"
          >
            <Input
              placeholder={t("placeholder-input-url-secret-code")}
              name="secretCode"
              type="password"
            />
          </Field>
        </div>
      ) : null}
    </Form>
  )
}
