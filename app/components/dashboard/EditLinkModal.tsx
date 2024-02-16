import { Tooltip, Modal } from "antd"
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Form, useNavigation } from "@remix-run/react"
import dayjs, { Dayjs } from "dayjs"

import { Input, Button, CalendarTimePicker, Divider } from "~/components/shared"
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
    setPath(data.path || "") // Reset path when modal is closed
    setDescription(data.description || "") // Reset description when modal is closed
    resetExpiredAt() // Reset expiredAt when modal is closed
    setSecretCode("")
  }

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    if (!isSuccess) {
      resetForm()
    }
  }, [resetForm]) // resetForm needs to be wrapped in useCallback too

  useEffect(() => {
    if (isSuccess) {
      closeModal()
    }
  }, [navigation.state])

  useEffect(() => {
    resetExpiredAt()
  }, [])

  const Title = () => {
    return (
      <div>
        <h1 className=" text-center font-semibold text-base text-black">
          Edit Tautan
        </h1>
        <h2 className=" text-center font-semibold text-sm text-gray-400">
          {data.url}
        </h2>
      </div>
    )
  }

  const handleDescChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value)
    },
    []
  )

  return (
    <Modal
      title={<Title />}
      open={isModalVisible}
      onOk={closeModal}
      onCancel={closeModal}
      centered
      footer={null}
    >
      <Form
        key={data.linkId}
        id={`edit-link-${data.linkId}`}
        method="post"
        action="/dashboard/links"
      >
        <input type="hidden" name="linkId" value={data.linkId} />
        <div className=" mb-2 flex flex-col sm:flex-row items-center">
          <p className=" w-full sm:w-1/4 font-semibold">Tautan Pendek</p>
          <Input
            prefix="pndek.in/"
            variant="prefix"
            placeholder="Tautan pendek"
            name="path"
            type="text"
            className="w-full sm:w-3/4"
            value={path} // Use state value
            onChange={(e) => setPath(e.target.value)} // Update state on change
          />
        </div>
        <div className=" mb-2 flex flex-col sm:flex-row items-center">
          <p className=" w-full sm:w-1/4 font-semibold">Deskripsi</p>
          <Input
            placeholder="Description"
            name="description"
            type="text"
            className="w-full sm:w-3/4"
            value={description} // Use state value
            onChange={handleDescChange} // Update state on change
          />
        </div>
        <div className=" mb-2 flex flex-col sm:flex-row items-center">
          <p className=" w-full sm:w-1/4 font-semibold">Kedaluwarsa</p>
          <CalendarTimePicker
            placeholder={t("placeholder-input-url-expired-at")}
            className="w-full sm:w-3/4"
            name="expiredAt"
            value={!!expiredAt ? expiredAt : null} // Use state value
            onChange={onChangeExpiredAt} // Update state on change
          />
        </div>
        <Divider className="mt-4">
          <div className=" flex mx-4">
            <input
              type="checkbox"
              name="editSecretCode"
              id={`editSecretCode-${data.linkId}`}
              onChange={handleEditSecretCode}
              className=" cursor-pointer"
            />
            <label
              htmlFor={`editSecretCode-${data.linkId}`}
              className="pl-2 cursor-pointer"
            >
              {t("additional-config")}
            </label>
          </div>
        </Divider>
        {isEditSecretCode && (
          <div className=" mb-2 flex flex-col sm:flex-row items-center mt-4">
            <p className=" w-full sm:w-1/4 font-semibold">Kode Rahasia</p>
            <Tooltip
              placement="topLeft"
              title={t("tooltip-input-url-secret-code")}
            >
              <span className="w-full sm:w-3/4">
                <Input
                  placeholder={t("placeholder-input-url-secret-code")}
                  name="secretCode"
                  type="password"
                  value={secretCode} // Use state value
                  onChange={(e) => setSecretCode(e.target.value)} // Update state on change
                />
              </span>
            </Tooltip>
          </div>
        )}
        <Button
          id={`submit-form-edit-link-${data.linkId}`}
          type="submit"
          name="intent"
          value="edit"
          className="mt-6"
        >
          Save
        </Button>
      </Form>
    </Modal>
  )
}
