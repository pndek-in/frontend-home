import { useState } from "react"
import { QRCode } from "antd"
import { Icon } from "@iconify-icon/react"

import Button from "./Button"
import { Popover } from "~/components/ui/popover"
import { Tooltip } from "~/components/ui/tooltip"
import { IconButton } from "~/components/ui/icon-button"

type QRButtonProps = {
  path: string
}

export default function QRButton({ path }: QRButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const link = `https://pndek.in/${path}?s=qr`

  const downloadQRCode = () => {
    const canvas = document
      .getElementById(`qr-${path}`)
      ?.querySelector<HTMLCanvasElement>("canvas")
    if (canvas) {
      const url = canvas.toDataURL()
      const a = document.createElement("a")
      a.download = `qrcode_${path}.png`
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <Tooltip content="QR Code">
      <Popover
        open={isVisible}
        onOpenChange={setIsVisible}
        side="bottom"
        align="center"
        trigger={
          <IconButton aria-label="QR Code">
            <Icon icon="mdi:qrcode-scan" />
          </IconButton>
        }
      >
        <div id={`qr-${path}`} className="flex w-52 flex-col items-center gap-2">
        <p className="break-all text-center font-semibold text-fg">{`pndek.in/${path}`}</p>
        <div className="rounded-control bg-white p-2">
          <QRCode
            value={link}
            size={180}
            bordered={false}
            bgColor="#fff"
            errorLevel="H"
          />
        </div>
        <Button onClick={downloadQRCode} isBlock>
          Download
        </Button>
        </div>
      </Popover>
    </Tooltip>
  )
}
