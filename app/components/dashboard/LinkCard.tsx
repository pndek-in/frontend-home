import { useTranslation } from "react-i18next"
import { useState, useCallback } from "react"
import { Form, useOutletContext } from "@remix-run/react"
import { Icon } from "@iconify-icon/react"
import dayjs from "dayjs"
import "dayjs/locale/id.js"
import { toast } from "react-toastify"

import { QRButton, ShareButton, Link } from "~/components/shared"
import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Tooltip } from "~/components/ui/tooltip"
import { IconButton } from "~/components/ui/icon-button"
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
    toast.success(t("copied"), {
      toastId: "copy-to-clipboard",
      position: "top-center",
      autoClose: 1000
    })
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  return (
    <Card elevation="raised" className="h-min w-full !overflow-visible">
      <Card.Body className="space-y-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {data.hasSecretCode && (
              <Tooltip content="This short url is protected with secret code">
                <Icon
                  icon="mdi:lock-check"
                  className="cursor-help text-lg text-brand-text"
                />
              </Tooltip>
            )}
            <button onClick={copyText} className="group min-w-0 text-start">
              <h2 className="break-all text-lg font-bold text-fg group-hover:text-brand-text">
                pndek.in/{data.path}
              </h2>
            </button>
            {isExpired ? (
              <Badge color="danger" pill>
                {t("expired-at").split(" ")[0]}
              </Badge>
            ) : data.status === 1 ? (
              <Badge color="success" pill dot>
                {t("active-link").split(" ")[0]}
              </Badge>
            ) : null}
          </div>
          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-normal text-fg-muted hover:text-fg hover:underline"
          >
            {data.url}
          </a>
        </div>

        {data.description && (
          <p className="text-sm italic text-fg-muted">{data.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="mdi:cursor-default-click-outline" className="text-base" />
            <span className="font-semibold text-fg">
              {numberHelper.formatNumber(data.totalClick)}
            </span>{" "}
            {t("clicks")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="mdi:clock-outline" className="text-base" />
            {createdAt}
          </span>
          {data.expiredAt && (
            <span
              className={`inline-flex items-center gap-1.5 ${
                isExpired ? "text-danger" : ""
              }`}
            >
              <Icon icon="mdi:timer-stop-outline" className="text-base" />
              {isExpired ? t("expired-at") : t("expires-at")}
              <span className="font-semibold">{expiredAt}</span>
            </span>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="flex items-center justify-between">
        {isModalVisible && (
          <EditLinkModal
            data={data}
            isSuccess={isSuccess}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
          />
        )}
        <div className="flex items-center gap-1">
          {data.status === 1 && (
            <>
              <Tooltip
                content={
                  context.user?.isVerified
                    ? t("edit-link")
                    : t("tooltip-need-verify-first")
                }
              >
                <IconButton
                  aria-label={t("edit-link")}
                  onClick={showModal}
                  disabled={!context.user?.isVerified}
                >
                  <Icon icon="mdi:link-edit" className="text-brand-text" />
                </IconButton>
              </Tooltip>
              <ShareButton path={data.path} />
              <QRButton path={data.path} />
            </>
          )}

          <Tooltip content={t("analytics")}>
            <Link
              to={`/dashboard/analytics/${data.linkId}`}
              aria-label={t("analytics")}
              className="jl-iconbtn jl-iconbtn--ghost jl-iconbtn--md"
            >
              <Icon icon="mdi:chart-areaspline" className="text-info" />
            </Link>
          </Tooltip>
        </div>

        <Tooltip content={data.status === 1 ? t("archive") : t("restore")}>
          <Form
            method="post"
            action={`/dashboard/links?status=${
              data.status === 1 ? "active" : "inactive"
            }`}
          >
            <input type="hidden" name="linkId" value={data.linkId} />
            <IconButton
              type="submit"
              name="intent"
              value={data.status === 1 ? "archive" : "restore"}
              disabled={!context.user?.isVerified}
              aria-label={data.status === 1 ? t("archive") : t("restore")}
            >
              <Icon
                icon={
                  data.status === 1 ? "mdi:archive-arrow-down" : "mdi:restore"
                }
                className="text-danger"
              />
            </IconButton>
          </Form>
        </Tooltip>
      </Card.Footer>
    </Card>
  )
}
