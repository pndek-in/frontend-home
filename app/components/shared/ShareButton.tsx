import { useState } from "react"
import { Tooltip, Popover } from "antd"
import { Icon } from "@iconify-icon/react"

import Link from "./Link"

type ShareButtonProps = {
  path: string
}

export default function ShareButton({ path }: ShareButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const link = `https://pndek.in/${path}`

  const handleVisibleChange = (isVisible: boolean) => {
    setIsVisible(isVisible)
  }

  const ShareMenu = () => {
    const socialMedias = [
      {
        name: "Facebook",
        icon: "logos:facebook",
        link: `https://www.facebook.com/sharer/sharer.php?u=${link}`
      },
      {
        name: "Twitter",
        icon: "logos:twitter",
        link: `https://twitter.com/intent/tweet?url=${link}`
      },
      {
        name: "WhatsApp",
        icon: "logos:whatsapp",
        link: `https://wa.me/?text=${link}`
      }
    ]

    return (
      <div className="flex flex-col items-start gap-2">
        {socialMedias.map((socialMedia, index) => (
          <Link
            key={index}
            to={socialMedia.link}
            target="_blank"
            rel="noreferrer"
            className=" flex items-center"
          >
            <Icon icon={socialMedia.icon} className=" max-w-3 mr-2" />
            Share to {socialMedia.name}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <Popover
      content={ShareMenu}
      trigger="click"
      open={isVisible}
      onOpenChange={handleVisibleChange}
      placement="right"
    >
      <>
        <Tooltip title="Share">
          <button>
            <Icon
              icon="mdi:share-variant-outline"
              className=" text-xl text-blue-500"
            />
          </button>
        </Tooltip>
      </>
    </Popover>
  )
}
