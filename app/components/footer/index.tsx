import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { Link } from "~/components/shared"

export default function Footer() {
  const currentYear = dayjs().year()
  const { t } = useTranslation()

  const links = [
    {
      name: "about",
      url: "/about"
    },
    {
      name: "privacy-policy",
      url: "/privacy-policy"
    },
    {
      name: "terms-of-service",
      url: "/terms-of-service"
    }
  ]

  return (
    <footer className="bg-white dark:bg-slate-200 h-full">
      <div className=" xl:max-w-7xl w-full mx-auto flex md:flex-row flex-col-reverse items-center justify-between p-5">
        <p className=" font-medium text-sm">
          © {currentYear}{" "}
          <Link to="https://jaluwibowo.id" target="_blank">
            Jalu Wibowo Aji
          </Link>
        </p>
        <div className=" flex md:space-x-4 flex-col md:flex-row space-y-4 md:space-y-0 items-center md:mb-0 mb-4">
          {links.map((link) => (
            <Link to={link.url} key={link.name}>
              {t(link.name)} {link.name === "about" && " pndek.in"}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
