import { useState, useEffect } from "react"
import { Icon } from "@iconify-icon/react"
import { Link, useLocation } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import Button from "./Button"

function Drawer() {
  const { t } = useTranslation()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

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
          <h2 className="text-lg font-semibold">Drawer Content</h2>
          <Link to="/register">
            <Button variant="danger">{t("logout")}</Button>
          </Link>
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

export default Drawer
