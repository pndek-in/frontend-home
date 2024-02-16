import { useTranslation } from "react-i18next"
import { Tooltip } from "antd"
import { useState, useCallback } from "react"
import { Form, useOutletContext } from "@remix-run/react"
import { Icon } from "@iconify-icon/react"
import dayjs from "dayjs"
import "dayjs/locale/id.js"
import { toast } from "react-toastify"

import { QRButton, ShareButton, Link } from "~/components/shared"
import EditLinkModal from "./EditLinkModal"
import { numberHelper, dateHelper } from "~/utils/helpers"

type LinkCardProps = {
  isSuccess?: boolean
  data: {
    linkId: number
    path: string
    url: string
    status: number
    description?: string
    createdAt: number
    expiredAt?: number
    totalClick: number
    hasSecretCode: boolean
  }
}

export default function LinkCard({ data, isSuccess }: LinkCardProps) {
  const { i18n, t } = useTranslation("dashboard")
  const context = useOutletContext() as any
  const format =
    i18n.language === "en" ? "h:mm A · MMM D, YYYY" : "H:mm · D MMM YYYY"
  const createdAt = dayjs(dateHelper.unixTimestampToDate(data.createdAt))
    .locale(i18n.language)
    .format(format)
  const expiredAt = dayjs(dateHelper.unixTimestampToDate(data.expiredAt || 0))
    .locale(i18n.language)
    .format(format)
  const isExpired = data.expiredAt && dayjs().isAfter(data.expiredAt)

  const copyText = () => {
    navigator.clipboard.writeText(`pndek.in/${data.path}`)
    toast.success("Copied to clipboard")
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  return (
    <div className=" bg-white shadow-md rounded-md p-4 w-full h-min">
      <div className="mb-4 pb-4 border-b">
        <div className=" flex items-center">
          {data.hasSecretCode && (
            <Tooltip
              title="This short url is protected with secret code"
              placement="top"
            >
              <div className=" flex items-center cursor-help">
                <Icon icon="mdi:lock-check" className="text-xl mr-2" />
              </div>
            </Tooltip>
          )}
          <button onClick={copyText} className=" text-start">
            <h2 className=" text-xl font-bold hover:underline cursor-pointer break-all">
              pndek.in/{data.path}
            </h2>
          </button>
        </div>
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className=" text-sm font-normal text-gray-400 hover:underline cursor-pointer break-all"
        >
          {data.url}
        </a>
      </div>
      {data.description && <p className="italic text-sm">{data.description}</p>}
      <p className=" text-sm">
        {createdAt} ·{" "}
        <span className=" font-semibold">
          {numberHelper.formatNumber(data.totalClick)}
        </span>{" "}
        Clicks
      </p>
      {data.expiredAt && (
        <div
          className={` flex items-center ${isExpired ? "text-red-500" : ""}`}
        >
          <Icon icon="mdi:timer-stop-outline" className=" text-sm mr-1" />
          <p className="text-sm">
            {isExpired ? `Expired at` : `Expires at`}
            <span className=" font-semibold"> {expiredAt}</span>
          </p>
        </div>
      )}

      <div className=" flex justify-between w-full mt-4 pt-4 border-t">
        <EditLinkModal
          data={data}
          isSuccess={isSuccess}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
        <div className=" flex space-x-4">
          {data.status === 1 && (
            <>
              <Tooltip title={t("tooltip-need-verify-first")}>
                <button
                  onClick={showModal}
                  disabled={!context.user?.isVerified}
                  className="cursor-pointer"
                >
                  <Icon
                    icon="mdi:link-edit"
                    className=" text-xl text-green-500"
                  />
                </button>
              </Tooltip>
              <ShareButton path={data.path} />
              <QRButton path={data.path} />
            </>
          )}

          <Tooltip title="Analytics">
            <>
              <Link to={`/dashboard/analytics/${data.linkId}`}>
                <Icon
                  icon="mdi:chart-areaspline"
                  className=" text-xl text-purple-500"
                />
              </Link>
            </>
          </Tooltip>
        </div>
        <Tooltip title={data.status === 1 ? "Archive" : "Restore"}>
          <div>
            <Form
              method="post"
              action={`/dashboard/links?status=${
                data.status === 1 ? "active" : "inactive"
              }`}
            >
              <input type="hidden" name="linkId" value={data.linkId} />
              <button
                name="intent"
                value={data.status === 1 ? "archive" : "restore"}
                disabled={!context.user?.isVerified}
                className="cursor-pointer"
              >
                <Icon
                  icon={
                    data.status === 1 ? "mdi:archive-arrow-down" : "mdi:restore"
                  }
                  className=" text-xl text-red-500"
                />
              </button>
            </Form>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
