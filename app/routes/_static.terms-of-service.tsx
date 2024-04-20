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
  const { t } = useTranslation("tos")
  const latestUpdate = "04-07-2024"
  const articles: Article[] = [
    {
      title: "",
      contents: [
        {
          type: "paragraph",
          text: t("welcome")
        }
      ]
    },
    {
      title: t("use-of-service-title"),
      contents: [
        {
          type: "list",
          text: t("use-of-service-content-1")
        },
        {
          type: "list",
          text: t("use-of-service-content-2"),
          childs: [
            t("use-of-service-content-2-1"),
            t("use-of-service-content-2-2"),
            t("use-of-service-content-2-3"),
            t("use-of-service-content-2-4"),
            t("use-of-service-content-2-5"),
            t("use-of-service-content-2-6"),
            t("use-of-service-content-2-7")
          ]
        }
      ]
    },
    {
      title: t("prohibited-title"),
      contents: [
        {
          type: "list",
          text: t("prohibited-content-1"),
          childs: [
            t("prohibited-content-1-1"),
            t("prohibited-content-1-2"),
            t("prohibited-content-1-3"),
            t("prohibited-content-1-4"),
            t("prohibited-content-1-5")
          ]
        },
        {
          type: "paragraph",
          text: t("prohibited-content-2")
        }
      ]
    },
    {
      title: t("user-responsibility-title"),
      contents: [
        {
          type: "list",
          text: t("user-responsibility-content-1"),
        },
        {
          type: "list",
          text: t("user-responsibility-content-2"),
        },
        {
          type: "list",
          text: t("user-responsibility-content-3"),
        }
      ]
    },
    {
      title: t("limitation-of-liability-title"),
      contents: [
        {
          type: "list",
          text: t("limitation-of-liability-content-1"),
        },
        {
          type: "list",
          text: t("limitation-of-liability-content-2"),
        }
      ]
    },
    {
      title: t("service-termination-title"),
      contents: [
        {
          type: "list",
          text: t("service-termination-content-1"),
        }
      ]
    },
    {
      title: t("term-change-title"),
      contents: [
        {
          type: "list",
          text: t("term-change-content-1"),
        },
        {
          type: "list",
          text: t("term-change-content-2"),
        }
      ]
    },
    {
      title: t("contact-title"),
      contents: [
        {
          type: "list",
          text: t("contact-content-1"),
        }
      ]
    }
  ]

  return (
    <div className=" min-h-screen flex items-center p-4 sm:p-32 flex-col">
      <Article
        title={"Ketentuan Layanan Aplikasi pndek.in"}
        articles={articles}
        latestUpdate={latestUpdate}
      />
    </div>
  )
}
