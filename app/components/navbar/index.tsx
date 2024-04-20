import { Link, Form } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import ThemeToggleButton from "./ThemeToggleButton"
import LanguageSelect from "./LanguageSelect"
import { Button, Drawer } from "~/components/shared"
import { Theme } from "~/types/theme"
import ImageLogo from "~/assets/logo.svg"

export default function Navbar({
  theme = Theme.Light,
  onThemeChanged = (_: string) => {},
  isLoggedIn,
  pathname,
  isError
}: {
  theme?: Theme
  onThemeChanged?: (theme: string) => void
  isLoggedIn: boolean
  pathname: string
  isError?: boolean
}) {
  const { t } = useTranslation()
  const isDashboard = pathname.includes("/dashboard")
  const homeLink = isDashboard ? "/dashboard" : "/"

  return (
    <header className=" bg-white dark:bg-slate-200 h-[64px] sticky top-0 z-10">
      <nav className="lg:max-w-7xl mx-auto flex flex-row-reverse sm:flex-row justify-between items-center p-5 h-16">
        <div className="sm:hidden flex items-center">
          <Drawer homeLink={homeLink} isLoggedIn={isLoggedIn} />
        </div>
        <Link to={homeLink}>
          <img src={ImageLogo} className=" h-8 w-auto" title="pndek.in" />
        </Link>
        {!isError && (
          <div className=" flex items-center">
            <ThemeToggleButton theme={theme} onThemeChanged={onThemeChanged} />
            <LanguageSelect className=" sm:block hidden ml-5" />
            <div className=" space-x-2 ml-5 sm:flex hidden">
              {isLoggedIn && isDashboard ? (
                <Form id="logout-form" method="post" action="/auth/logout">
                  <Button type="submit" variant="danger">
                    {t("logout")}
                  </Button>
                </Form>
              ) : isLoggedIn && !isDashboard ? (
                <Link to="/dashboard">
                  <Button>{t("dashboard")}</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button>{t("login")}</Button>
                  </Link>
                  <Link to="/register">
                    <Button>{t("register")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
