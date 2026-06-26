import { useTranslation } from "react-i18next"

import { clientCookie } from "~/utils/helpers"
import { Select } from "~/components/shared"

export default function LanguageSelect({ className = "", isBlock = false }) {
  const { i18n } = useTranslation()
  // i18n.language may be a full locale (e.g. "en-US"); normalize to the base
  // language so it matches the "en" / "id" option values.
  const currentLang = i18n.language?.startsWith("id") ? "id" : "en"

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
        value={currentLang}
        onChange={(e) => changeLanguage(e)}
        options={options}
        isBlock={isBlock}
      />
    </div>
  )
}
