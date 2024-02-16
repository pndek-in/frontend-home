import { useTranslation } from "react-i18next"

import { clientCookie } from "~/utils/helpers"
import { userState } from "~/services/cookies.server"
import { Select } from "~/components/shared"

export default function LanguageSelect({ className = "" }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language, async (error) => {
      // set the language to the html tag
      document.documentElement.lang = language
      // set the language to the cookie
      document.cookie = clientCookie.stringify("i18next", language, {
        httpOnly: false
      })
    })
  }

  const getLangLabel = (lang: string) => {
    switch (lang) {
      case "en":
        return "🇬🇧 English"
      case "id":
        return "🇮🇩 Indonesia"
      default:
        return "🇬🇧 English"
    }
  }

  const options = [
    { value: "en", label: getLangLabel("en") },
    { value: "id", label: getLangLabel("id") }
  ]

  return (
    <div className={className}>
      <Select
        defaultValue={getLangLabel(currentLang)}
        onChange={(e) => changeLanguage(e)}
        options={options}
      />
    </div>
  )
}
