import dayjs from "dayjs"

const dateToUnixTimestamp = (date: Date): number => {
  return dayjs(date).unix()
}

const unixTimestampToDate = (timestamp: number): Date => {
  return dayjs.unix(timestamp).toDate()
}

export default {
  dateToUnixTimestamp,
  unixTimestampToDate
}
