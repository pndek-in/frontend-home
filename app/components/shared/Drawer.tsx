import { useState, useEffect } from "react"
import { Icon } from "@iconify-icon/react"
import { Form, useLocation } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

import { Button, Link } from "~/components/shared"
import LanguageSelect from "~/components/navbar/LanguageSelect"
import { dashboardMenu, footerMenu } from "~/utils/constants"
import ImageLogo from "~/assets/logo.svg"

type DrawerProps = {
  isLoggedIn: boolean
  homeLink: string
}

export default function Drawer({ isLoggedIn, homeLink }: DrawerProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const currentYear = dayjs().year()

  // Close the drawer when the location changes
  useEffect(() => {
    setIsOpen(false)
  }, [location]) // Dependency array includes location

  return (
    <div>
      <Button isFit onClick={() => setIsOpen(!isOpen)}>
        <Icon icon={isOpen ? "line-md:align-left" : "line-md:align-justify"} />
      </Button>

      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-100 shadow transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className=" mb-4">
            <Link to={homeLink}>
              <img src={ImageLogo} className=" h-8 w-auto" title="pndek.in" />
            </Link>
          </div>
          <LanguageSelect isBlock className=" my-4 w-full" />
          {isLoggedIn ? (
            <>
              <hr className=" border-gray-400" />
              <ul className=" space-y-4 my-4">
                {dashboardMenu.map((menu, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Icon icon={menu.icon} />
                    <Link to={menu.url} className=" font-semibold">
                      <span>{t(menu.name)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr className=" border-gray-400" />
            </>
          ) : (
            <div className=" flex flex-col space-y-4">
              <Link to="/login">
                <Button isBlock>{t("login")}</Button>
              </Link>
              <Link to="/register">
                <Button isBlock>{t("register")}</Button>
              </Link>
            </div>
          )}
          <ul className=" space-y-4 mt-4">
            {footerMenu.map((link, i) => (
              <li key={i} className="flex flex-col text-center">
                <Link to={link.url} key={link.name}>
                  {t(link.name)} {link.name === "about" && " pndek.in"}
                </Link>
              </li>
            ))}
          </ul>
          <p className=" mt-4 font-medium text-sm text-center">
            © {currentYear}{" "}
            <Link to="https://pndek.in/jalu" target="_blank">
              Jalu Wibowo Aji
            </Link>
          </p>

          {isLoggedIn && (
            <Form
              id="logout-form"
              method="post"
              action="/auth/logout"
              className="mt-4"
            >
              <Button type="submit" variant="danger" isBlock>
                {t("logout")}
              </Button>
            </Form>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  )
}
