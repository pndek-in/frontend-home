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
  i18n: ["meta", "privacy"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-privacy-title") },
    { name: "description", content: t("meta-privacy-desc") }
  ]
}

export default function PrivacyPolicy() {
  const { t } = useTranslation("privacy")
  const latestUpdate = "04-07-2024"
  const articles: Article[] = [
    {
      title: t("introduction-title"),
      contents: [
        {
          type: "paragraph",
          text: t("introduction-content-1")
        }
      ]
    },
    {
      title: t("collected-info-title"),
      contents: [
        {
          type: "list",
          text: t("collected-info-content-1")
        },
        {
          type: "list",
          text: t("collected-info-content-2")
        },
        {
          type: "list",
          text: t("collected-info-content-3")
        },
        {
          type: "list",
          text: t("collected-info-content-4")
        }
      ]
    },
    {
      title: t("use-of-info-title"),
      contents: [
        {
          type: "paragraph",
          text: t("use-of-info-content-1"),
          childs: [
            t("use-of-info-content-1-1"),
            t("use-of-info-content-1-2"),
            t("use-of-info-content-1-3"),
            t("use-of-info-content-1-4"),
            t("use-of-info-content-1-5")
          ]
        }
      ]
    },
    {
      title: t("info-disclosure-title"),
      contents: [
        {
          type: "paragraph",
          text: t("info-disclosure-content-1"),
          childs: [
            t("info-disclosure-content-1-1"),
            t("info-disclosure-content-1-2"),
            t("info-disclosure-content-1-3"),
            t("info-disclosure-content-1-4")
          ]
        }
      ]
    },
    {
      title: t("data-storage-title"),
      contents: [
        {
          type: "paragraph",
          text: t("data-storage-content-1")
        }
      ]
    },
    {
      title: t("data-security-title"),
      contents: [
        {
          type: "paragraph",
          text: t("data-security-content-1")
        }
      ]
    },
    {
      title: t("privacy-changes-title"),
      contents: [
        {
          type: "paragraph",
          text: t("privacy-changes-content-1")
        }
      ]
    },
    {
      title: t("contact-title"),
      contents: [
        {
          type: "paragraph",
          text: t("contact-content-1")
        }
      ]
    }
  ]

  return (
    <div className=" min-h-screen flex items-center p-4 sm:p-32 flex-col">
      <Article
        title={"Kebijakan Privasi pndek.in"}
        articles={articles}
        latestUpdate={latestUpdate}
      />
    </div>
  )
}
