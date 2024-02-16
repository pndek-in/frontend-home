import { json } from "@remix-run/node"
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react"
import { useMemo, useState, useEffect } from "react"
import { useChangeLanguage } from "remix-i18next"
import { useTranslation } from "react-i18next"
import { ToastContainer, toast } from "react-toastify"
import toastStyle from "react-toastify/dist/ReactToastify.css"

import styles from "~/styles/tailwind.css"
import antd from "~/styles/antd.css"
import { Theme } from "~/types/theme"
import { getThemeFromCookies } from "~/services/theme.server"
import { userState, globalToast } from "~/services/cookies.server"
import i18next from "~/services/i18next.server"
import { getLocale } from "~/utils/helpers"
import { Footer, Navbar, Loading } from "~/components"

type ToastData = {
  content?: string
  type?: "success" | "error" | "info"
}

export async function loader({ request }: LoaderFunctionArgs) {
  let locale = getLocale(request)
  if (!locale) {
    locale = await i18next.getLocale(request) // ? <- this always return the browser language"
  }

  const theme = getThemeFromCookies(request)
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const isLoggedIn = Boolean(user.token)

  const toastData: ToastData | null =
    (await globalToast.parse(request.headers.get("Cookie"))) || null

  const pathname = new URL(request.url).pathname

  return json({ locale, theme, toastData, isLoggedIn, pathname })
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common"
}

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.svg",
    type: "image/svg+xml"
  },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: antd },
  { rel: "stylesheet", href: toastStyle },
  {
    rel: "stylesheet",
    href: "/antd.css"
  }
]

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}

export default function App() {
  // Get the locale from the loader
  const { locale, theme, toastData, isLoggedIn, pathname } =
    useLoaderData<typeof loader>()
  const context = { isLoggedIn }

  const [currentTheme, setCurrentTheme] = useState(theme as Theme)

  const onThemeChanged = (theme: string) => {
    setCurrentTheme(theme as Theme)
  }

  const { i18n } = useTranslation()
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale)

  const htmlProps = useMemo(() => {
    return {
      className: theme === "system" ? undefined : theme
    }
  }, [theme])

  useEffect(() => {
    if (toastData) {
      toast[toastData.type || "success"](toastData.content, {
        toastId: "success-toast",
        position: "top-center"
      })
    }
  }, [toastData])

  return (
    <html lang={locale} dir={i18n.dir()} {...htmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className=" bg-slate-200 dark:bg-slate-600">
        <Navbar
          theme={currentTheme}
          onThemeChanged={onThemeChanged}
          isLoggedIn={isLoggedIn}
          pathname={pathname}
        />
        <Loading />
        <Outlet context={context} />
        <ToastContainer />
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
