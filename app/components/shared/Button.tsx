import React, { ReactNode } from "react"

interface CustomButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger"
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
  ...otherProps
}) => {
  const variants = {
    primary:
      "bg-blue-500 hover:bg-blue-400 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary:
      "bg-gray-500 hover:bg-gray-400 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500",
    danger:
      "bg-red-500 hover:bg-red-400 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-500"
  }

  const fit = isFit ? "p-2" : "px-5 py-2"
  const group = isGroup ? "rounded-r-lg" : "rounded-lg"
  const block = isBlock ? "w-full" : "w-fit"

  return (
    <button
      onClick={onClick}
      className={` text-white font-semibold text-sm  focus:outline-none flex items-center justify-center ${block} ${fit} ${group} ${variants[variant]} ${className} disabled:opacity-50`}
      type={type}
      {...otherProps}
    >
      {children}
    </button>
  )
}

export default Button
