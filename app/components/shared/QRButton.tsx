import { useState } from "react"
import { Tooltip, Popover, QRCode } from "antd"
import { Icon } from "@iconify-icon/react"

import Button from "./Button"

type QRButtonProps = {
  path: string
}

export default function QRButton({ path }: QRButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const link = `https://pndek.in/${path}?s=qr`

  const handleVisibleChange = (isVisible: boolean) => {
    setIsVisible(isVisible)
  }

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

  const QRSection = () => {
    return (
      <div id={`qr-${path}`} className="flex flex-col items-center w-52">
        <p className=" text-center font-semibold break-all">{`pndek.in/${path}`}</p>
        <QRCode
          value={link}
          size={200}
          bordered={false}
          bgColor="#fff"
          errorLevel="H"
        />
        <Button onClick={downloadQRCode}>Download</Button>
      </div>
    )
  }

  return (
    <Popover
      content={QRSection}
      trigger="click"
      open={isVisible}
      onOpenChange={handleVisibleChange}
      placement="right"
    >
      <>
        <Tooltip title="QR Code">
          <button>
            <Icon icon="mdi:qrcode-scan" className=" text-xl" />
          </button>
        </Tooltip>
      </>
    </Popover>
  )
}
