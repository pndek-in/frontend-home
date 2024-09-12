import dayjs from "dayjs"

const dateToUnixTimestamp = (date: Date): number => {
  return dayjs(date).unix()
}

const unixTimestampToDate = (timestamp: number): Date => {
  return dayjs.unix(timestamp).toDate()
}

const getEnglishDate = (date: string): string => {
  const monthMap = {
    Januari: "January",
    Februari: "February",
    Maret: "March",
    April: "April",
    Mei: "May",
    Juni: "June",
    Juli: "July",
    Agustus: "August",
    September: "September",
    Oktober: "October",
    November: "November",
    Desember: "December"
  } as Record<string, string>

  const dateArray = date.split(" ") as string[]
  const month = monthMap[dateArray[1]] as string

  if (month) {
    dateArray[1] = month
  }

  return dateArray.join(" ")
}

export default {
  getEnglishDate,
  dateToUnixTimestamp,
  unixTimestampToDate
}
