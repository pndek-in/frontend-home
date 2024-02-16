import { useTranslation } from "react-i18next"
import { DatePicker } from "antd"
import type { DatePickerProps } from "antd"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/id.js"

type CalendarRangePickerProps = {
  className?: string
  maxRange?: number
  [key: string]: any // Additional props
}

export default function CalendarRangePicker({
  className,
  maxRange = 7,
  ...otherProps
}: CalendarRangePickerProps) {
  const { i18n } = useTranslation()

  const { RangePicker } = DatePicker
  const disabledDate: DatePickerProps["disabledDate"] = (
    current: Dayjs,
    { from }: { from?: Dayjs }
  ) => {
    if (from) {
      return Math.abs(current.diff(from, "days")) >= maxRange
    }

    return false
  }

  const customFormat: DatePickerProps["format"] = (value) => {
    return value
      ? dayjs(value).locale(i18n.language).format("DD MMMM YYYY")
      : ""
  }

  // defaulValue is today to maxRange backwards
  const today = dayjs()
  const defaultValues: [Dayjs, Dayjs] = [today.subtract(maxRange, "day"), today]

  return (
    <RangePicker
      className={`h-[38px] rounded-lg text-sm font-sans ${className}`}
      disabledDate={disabledDate}
      format={customFormat}
      allowClear={false}
      defaultValue={defaultValues}
      {...otherProps}
    />
  )
}
