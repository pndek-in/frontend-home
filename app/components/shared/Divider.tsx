import { ReactNode } from "react"

type DividerWithTextProps = {
  text?: string
  children?: ReactNode
  className?: string
}

const DividerWithText = ({
  text,
  children,
  className
}: DividerWithTextProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex-grow border-t border-gray-300" />
      {!children ? (
        <span className="mx-4 text-sm text-gray-600">{text}</span>
      ) : (
        children
      )}
      <div className="flex-grow border-t border-gray-300" />
    </div>
  )
}

export default DividerWithText
