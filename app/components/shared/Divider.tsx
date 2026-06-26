import { ReactNode } from "react"

import { Divider as JLDivider } from "~/components/ui/divider"

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
  const label = children ?? text
  return <JLDivider label={label} className={className} />
}

export default DividerWithText
