import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Form, useNavigation } from "@remix-run/react"
import dayjs, { Dayjs } from "dayjs"

import { Input, Button, CalendarTimePicker } from "~/components/shared"
import { Dialog } from "~/components/ui/dialog"
import { Field } from "~/components/ui/field"
import { Tooltip } from "~/components/ui/tooltip"
import { Checkbox } from "~/components/ui/checkbox"
import { dateHelper } from "~/utils/helpers"

type EditLinkProps = {
  isModalVisible: boolean
  setIsModalVisible: (value: boolean) => void
  isSuccess?: boolean
  data: {
    linkId: number
    path: string
    url: string
    description?: string
    createdAt: number
    expiredAt?: number
    totalClick: number
    hasSecretCode: boolean
  }
}

export default function EditLink({
  data,
  isSuccess,
  setIsModalVisible,
  isModalVisible
}: EditLinkProps) {
  const { t } = useTranslation("dashboard")
  const navigation = useNavigation()
  const [path, setPath] = useState(data.path || "")
  const [description, setDescription] = useState(data.description || "")
  const [expiredAt, setExpiredAt] = useState<Dayjs | null>(dayjs())
  const [secretCode, setSecretCode] = useState("")
  const [isEditSecretCode, setIsEditSecretCode] = useState(false)

  const handleEditSecretCode = useCallback(() => {
    setIsEditSecretCode((prev) => !prev)
  }, [])

  const onChangeExpiredAt = useCallback((value: Dayjs) => {
    setExpiredAt(value)
  }, [])

  const resetExpiredAt = () => {
    const expire = data.expiredAt
      ? dayjs(dateHelper.unixTimestampToDate(data.expiredAt))
      : null
    setExpiredAt(expire)
  }

  const resetForm = () => {
    setPath(data.path || "")
    setDescription(data.description || "")
    resetExpiredAt()
    setSecretCode("")
  }

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    if (!isSuccess) {
      resetForm()
    }
  }, [resetForm])

  useEffect(() => {
    if (isSuccess) {
      closeModal()
    }
  }, [navigation.state])

  useEffect(() => {
    resetExpiredAt()
  }, [])

  const handleDescChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value)
    },
    []
  )

  return (
    <Dialog
      open={isModalVisible}
      onClose={closeModal}
      size="md"
      title={t("edit-link")}
      description={data.url}
    >
      <Form
        key={data.linkId}
        id={`edit-link-${data.linkId}`}
        method="post"
        action="/dashboard/links"
        className="space-y-4 pb-6"
      >
        <input type="hidden" name="linkId" value={data.linkId} />

        <Field label={t("short-link")} htmlFor={`edit-path-${data.linkId}`}>
          <Input
            id={`edit-path-${data.linkId}`}
            prefix="pndek.in/"
            variant="prefix"
            placeholder={t("short-link")}
            name="path"
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </Field>

        <Field label={t("description")} htmlFor={`edit-desc-${data.linkId}`}>
          <Input
            id={`edit-desc-${data.linkId}`}
            placeholder={t("placeholder-input-url-description")}
            name="description"
            type="text"
            value={description}
            onChange={handleDescChange}
          />
        </Field>

        <Field label={t("expires")}>
          <CalendarTimePicker
            placeholder={t("placeholder-input-url-expired-at")}
            name="expiredAt"
            value={!!expiredAt ? expiredAt : null}
            onChange={onChangeExpiredAt}
          />
        </Field>

        <Checkbox
          id={`editSecretCode-${data.linkId}`}
          name="editSecretCode"
          label={t("additional-config")}
          checked={isEditSecretCode}
          onChange={handleEditSecretCode}
        />

        {isEditSecretCode && (
          <Field label={t("secret-code")} hint={t("tooltip-input-url-secret-code")}>
            <Tooltip content={t("tooltip-input-url-secret-code")}>
              <span className="block w-full">
                <Input
                  placeholder={t("placeholder-input-url-secret-code")}
                  name="secretCode"
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />
              </span>
            </Tooltip>
          </Field>
        )}

        <Button
          id={`submit-form-edit-link-${data.linkId}`}
          type="submit"
          name="intent"
          value="edit"
          isBlock
          className="mt-2"
        >
          {t("save")}
        </Button>
      </Form>
    </Dialog>
  )
}
