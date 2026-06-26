import { Select as JLSelect } from "~/components/ui/select"

type DropdownProps = {
  defaultValue?: string
  value?: string
  width?: string // tailwindcss width class
  onChange?: (value: string) => void
  options?: {
    label: string
    value: string
  }[]
  isBlock?: boolean
  className?: string
}

function Dropdown({
  defaultValue,
  value,
  options = [],
  onChange,
  isBlock,
  className = ""
}: DropdownProps) {
  return (
    <div style={{ width: isBlock ? "100%" : "fit-content" }}>
      <JLSelect
        value={value}
        defaultValue={value == null ? defaultValue : undefined}
        options={options}
        className={className}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}

export default Dropdown
