import { useTranslation } from "react-i18next"
import { Form } from "@remix-run/react"
import { toast } from "react-toastify"
import { Icon } from "@iconify-icon/react"

import { Button, ShareButton, QRButton } from "~/components/shared"
import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Tooltip } from "~/components/ui/tooltip"

type UnclaimedLinkProps = {
  linkData: {
    id: number
    url: string
    path: string
  }
}

export default function UnclaimedLink({ linkData }: UnclaimedLinkProps) {
  const { t } = useTranslation("common")

  const copyText = (path: string) => {
    navigator.clipboard.writeText(`pndek.in/${path}`)
    toast.success("Copied to clipboard", {
      toastId: "copy-to-clipboard",
      position: "top-center",
      autoClose: 1000
    })
  }

  return (
    <Card elevation="raised" className="border-brand/40 !overflow-visible">
      <Card.Body className="space-y-3">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyText(linkData.path)}
              className="group min-w-0 text-start"
            >
              <h2 className="break-all text-lg font-bold text-fg group-hover:text-brand-text">
                pndek.in/{linkData.path}
              </h2>
            </button>
            <Badge color="warning" pill>
              {t("claim").split(" ")[0]}
            </Badge>
          </div>
          <a
            href={linkData.url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-normal text-fg-muted hover:text-fg hover:underline"
          >
            {linkData.url}
          </a>
        </div>
      </Card.Body>
      <Card.Footer className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ShareButton path={linkData.path} />
          <QRButton path={linkData.path} />
          <Tooltip content={t("analytics-claim-first")}>
            <span className="jl-iconbtn jl-iconbtn--ghost jl-iconbtn--md cursor-help">
              <Icon icon="mdi:chart-areaspline" className="text-info" />
            </span>
          </Tooltip>
        </div>
        <Form
          id="claim-unclaimed-link"
          method="post"
          action="/dashboard/links"
        >
          <Button type="submit" name="intent" value="claim">
            {t("claim")}
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  )
}
