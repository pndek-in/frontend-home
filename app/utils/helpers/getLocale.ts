import { clientCookie } from "~/utils/helpers"

export const getLocale = (req: Request) => {
  const locale = clientCookie.get("i18next", req.headers.get("Cookie") || "")

  return locale
}
