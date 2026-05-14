export const convertToUnixTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000)
}

export const compareUnixTimestamp = (
  date1: number,
  date2: number
): -1 | 0 | 1 => {
  if (date1 > date2) return 1
  if (date1 < date2) return -1
  return 0
}
