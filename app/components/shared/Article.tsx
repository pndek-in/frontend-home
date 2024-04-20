import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import "dayjs/locale/id.js"

type Content = {
  type: "paragraph" | "list"
  text: string
  childs?: string[]
}

type Article = {
  title: string
  contents: Content[]
}

type ArticleProps = {
  title: string
  articles: Article[]
  latestUpdate?: string
}

export default function Article({
  title,
  articles,
  latestUpdate
}: ArticleProps) {
  const { t, i18n } = useTranslation()
  const latestUpdateDate = dayjs(latestUpdate)
    .locale(i18n.language)
    .format("D MMMM YYYY")

  return (
    <>
      <h1 className="text-2xl font-bold mb-16 text-gray-800 dark:text-gray-200">
        {title}
      </h1>
      {articles.map((article, iArticle) => (
        <div key={iArticle} className="w-full lg:w-3/4 mb-8">
          {article.title && (
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
              {article.title}
            </h2>
          )}
          <ul className="pl-4">
            {article.contents.map((content, iContent) => (
              <div key={`${iArticle}-${iContent}`}>
                <li
                  className={`text-sm text-gray-800 dark:text-gray-200 mb-4 ${
                    content.type === "list" ? " list-disc ml-4" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: content.text }}
                />
                {content.childs && (
                  <ul className="pl-4">
                    {content.childs.map((child, iChild) => (
                      <li
                        key={`${iArticle}-${iContent}-${iChild}`}
                        className="text-sm text-gray-800 dark:text-gray-200 mb-4 list-disc ml-4"
                        dangerouslySetInnerHTML={{ __html: child }}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ul>
        </div>
      ))}

      {latestUpdate && (
        <p className="text-sm text-gray-800 lg:w-3/4 dark:text-gray-200 mt-8 w-full">
          {t("last-updated")}: {latestUpdateDate}
        </p>
      )}
    </>
  )
}
