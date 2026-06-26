import { useState } from "react"
import { Icon } from "@iconify-icon/react"

import Link from "./Link"
import { Popover } from "~/components/ui/popover"
import { Tooltip } from "~/components/ui/tooltip"
import { IconButton } from "~/components/ui/icon-button"

type ShareButtonProps = {
  path: string
}

export default function ShareButton({ path }: ShareButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const link = `https://pndek.in/${path}`

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
      icon: "logos:whatsapp-icon",
      link: `https://wa.me/?text=${link}`
    }
  ]

  return (
    <Tooltip content="Share">
      <Popover
        open={isVisible}
        onOpenChange={setIsVisible}
        side="bottom"
        align="center"
        trigger={
          <IconButton aria-label="Share">
            <Icon icon="mdi:share-variant-outline" className="text-info" />
          </IconButton>
        }
      >
        <div className="flex flex-col items-start gap-1">
          {socialMedias.map((socialMedia, index) => (
            <Link
              key={index}
              to={socialMedia.link}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-fg hover:bg-surface-hover"
            >
              <Icon icon={socialMedia.icon} className="text-lg" />
              Share to {socialMedia.name}
            </Link>
          ))}
        </div>
      </Popover>
    </Tooltip>
  )
}
