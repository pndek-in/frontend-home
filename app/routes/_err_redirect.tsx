import { json } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isServerError = request.url.includes("link-server-error")

  return json({ isServerError })
}

export default function ErrorRedirect() {
  const { isServerError } = useLoaderData<typeof loader>()
  const { t } = useTranslation("error")

  return (
    <div className="min-h-[calc(100vh-64px-60px)] flex items-center justify-center text-gray-800 dark:text-gray-200">
      <div className=" w-full md:w-96">
        <Outlet />
        <p className=" mt-4">{isServerError ? t("try-again-later") : t("try-again")}</p>
      </div>
    </div>
  )
}
