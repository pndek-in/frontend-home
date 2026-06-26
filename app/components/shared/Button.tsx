import React, { ReactNode, CSSProperties } from "react"

import { Button as JLButton } from "~/components/ui/button"

interface CustomButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger" | "ghost" | "subtle"
  isFit?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  isBlock?: boolean
  isGroup?: boolean
  className?: string
  [key: string]: any // Additional props
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = "primary",
  isGroup,
  onClick,
  isFit,
  type = "button",
  isBlock,
  className,
  style,
  ...otherProps
}) => {
  // `isGroup` historically flattened the left edge so the button could sit
  // flush against a grouped input (e.g. the Hero shorten field).
  const groupStyle: CSSProperties = isGroup
    ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
    : {}

  return (
    <JLButton
      variant={variant}
      size={isFit ? "sm" : "md"}
      fullWidth={isBlock}
      onClick={onClick}
      type={type}
      className={className}
      style={{ ...groupStyle, ...style }}
      {...otherProps}
    >
      {children}
    </JLButton>
  )
}

export default Button
