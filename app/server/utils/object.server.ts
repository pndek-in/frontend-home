export const sortObjectByValue = (
  obj: Record<string, number>,
  order: "asc" | "desc" = "desc"
): Record<string, number> => {
  return Object.keys(obj)
    .sort((a, b) =>
      order === "asc" ? obj[a] - obj[b] : obj[b] - obj[a]
    )
    .reduce<Record<string, number>>((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
}
