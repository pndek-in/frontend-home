import { useTranslation } from "react-i18next"
import "dayjs/locale/id.js"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker } from "antd"
import type { DatePickerProps } from "antd/es/date-picker"
import { Icon } from "@iconify-icon/react"

type CalendarTimePickerProps = {
  placeholder?: string
  className?: string
  [key: string]: any // Additional props
}

export default function CalendarTimePicker({
  placeholder,
  className,
  ...otherProps
}: CalendarTimePickerProps) {
  const { i18n } = useTranslation()

  const range = (start: number, end: number) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    // Can not select days before today
    return current < dayjs().startOf("day")
  }

  const disabledDateTime = (current: Dayjs | null) => {
    const now = dayjs()

    // if now and current have same date and hour
    // then we need to disable all hour & minutes before now
    // else we can enable all hour & minutes

    if (current && now.isSame(current, "hour")) {
      return {
        disabledHours: () => range(0, now.hour()),
        disabledMinutes: () => range(0, now.minute())
      }
    } else if (current && now.isSame(current, "day")) {
      return {
        disabledHours: () => range(0, now.hour())
      }
    } else {
      return {}
    }
  }

  const customFormat: DatePickerProps["format"] = (value) => {
    return value
      ? dayjs(value).locale(i18n.language).format("DD MMMM YYYY HH:mm")
      : ""
  }

  return (
    <DatePicker
      placeholder={placeholder}
      className={`h-[38px] rounded-lg text-sm font-sans w-full ${className}`}
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      showTime={{
        hideDisabledOptions: true,
        format: "HH:mm"
      }}
      showNow={false}
      suffixIcon={<Icon icon="mdi:calendar" className=" text-gray-500" />}
      format={customFormat}
      {...otherProps}
    />
  )
}
