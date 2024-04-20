import type { MetaFunction } from "@remix-run/node"
import { useTranslation } from "react-i18next"

import { Article } from "~/components/shared"

type Content = {
  type: "paragraph" | "list"
  text: string
  childs?: string[]
}

type Article = {
  title: string
  contents: Content[]
}

export const handle = {
  i18n: ["meta", "about"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-about-title") },
    { name: "description", content: t("meta-about-desc") }
  ]
}

export default function About() {
  const { t } = useTranslation("about")
  const articles: Article[] = [
    {
      title: "",
      contents: [
        {
          type: "paragraph",
          text: t("about-pndek-in")
        },
        {
          type: "paragraph",
          text: t("stacks"),
          childs: [
            "Remix",
            "Tailwind CSS",
            "Telegram Bot API",
            "Express",
            "Google Safe Browsing API",
            "PostgreSQL",
            "Redis",
          ]
        },
        {
          type: "paragraph",
          text: t("inquiry")
        }
      ]
    }
  ]

  return (
    <div className=" min-h-screen flex items-center p-4 sm:p-32 flex-col">
      <Article
        title={"Tentang pndek.in"}
        articles={articles}
      />
    </div>
  )
}
