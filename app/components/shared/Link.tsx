import { Link as RemixLink } from "@remix-run/react"
import React, { ReactNode } from "react"

interface LinkProps {
  to: string
  children: ReactNode
  className?: string
  [key: string]: any // Additional props
}

const defaultClasses = "font-semibold text-sm text-blue-700 hover:underline dark:text-blue-500"

const Link: React.FC<LinkProps> = ({
  children,
  to,
  className,
  ...otherProps
}) => {
  const combinedClasses = `${defaultClasses} ${className || ""}`.trim()

  return otherProps?.target === "_blank" ? (
    <a
      href={to}
      className={combinedClasses}
      target="_blank"
      rel="noreferrer"
      {...otherProps}
    >
      {children}
    </a>
  ) : (
    <RemixLink to={to} className={combinedClasses} {...otherProps}>
      {children}
    </RemixLink>
  )
}

export default Link
