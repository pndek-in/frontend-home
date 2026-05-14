export const upperCaseFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const kebabToCamel = (string: string): string => {
  return string.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}
