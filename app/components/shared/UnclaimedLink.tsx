import { useTranslation } from "react-i18next"
import { Form } from "@remix-run/react"
import { toast } from "react-toastify"
import { Icon } from "@iconify-icon/react"
import { Tooltip } from "antd"

import { Button, ShareButton, QRButton } from "~/components/shared"

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
    <div className=" w-full bg-white p-4 rounded-md flex justify-between items-center">
      <div className=" flex flex-col">
        <button onClick={() => copyText(linkData.path)} className=" text-start">
          <h2 className=" text-xl font-bold hover:underline cursor-pointer break-all">
            pndek.in/{linkData.path}
          </h2>
        </button>
        <a
          href={linkData.url}
          target="_blank"
          rel="noreferrer"
          className=" text-sm font-normal text-gray-400 hover:underline cursor-pointer break-all"
        >
          {linkData.url}
        </a>
      </div>
      <div className=" flex flex-col space-y-2">
        <div className=" flex items-center justify-center space-x-4">
          <ShareButton path={linkData.path} />
          <QRButton path={linkData.path} />
          <Tooltip title={t("analytics-claim-first")}>
            <>
              <Icon
                icon="mdi:chart-areaspline"
                className=" text-xl text-purple-500 cursor-help"
              />
            </>
          </Tooltip>
        </div>

        <Form
          id="claim-unclaimed-link"
          method="post"
          action="/dashboard/links"
          className=" w-full"
        >
          <Button type="submit" className=" h-min" name="intent" value="claim">
            {t("claim")}
          </Button>
        </Form>
      </div>
    </div>
  )
}
