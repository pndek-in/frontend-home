import { clientCookie } from "~/utils/helpers"
import { Theme } from "~/types/theme"

export function getThemeFromCookies(request: Request) {
  const theme = clientCookie.get("theme", request.headers.get("Cookie") || "")

  return theme || ("light" as Theme)
}
