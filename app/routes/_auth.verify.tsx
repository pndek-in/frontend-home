import { json, redirect } from "@remix-run/node"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

import { userState } from "~/services/cookies.server"
import { verifyEmail } from "~/server/services/auth.server"

export const handle = {
  i18n: ["meta"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-verify-title") },
    { name: "description", content: t("meta-verify-desc") }
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = new Headers()
  const { searchParams } = new URL(request.url)
  const verifyToken = searchParams.get("t")

  if (!verifyToken) return redirect("/404", { headers })

  let isVerificationSuccess = false
  try {
    await verifyEmail(verifyToken)
    isVerificationSuccess = true
  } catch {
    isVerificationSuccess = false
  }

  headers.append(
    "Set-Cookie",
    await userState.serialize({ token: "" }, { path: "/" })
  )

  return json({ isVerificationSuccess }, { headers })
}

export default function Index() {
  const { isVerificationSuccess } = useLoaderData<typeof loader>()
  const { t } = useTranslation("auth")

  const [timer, setTimer] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    if (timer === 0) {
      clearInterval(interval)
      window.location.href = "/login"
    }

    return () => clearInterval(interval)
  }, [timer])

  return (
    <div className=" text-center">
      <p>
        {isVerificationSuccess
          ? t("email-verified")
          : t("email-verification-failed")}
      </p>
      <p>{t("will-redirect", { timer })}</p>
    </div>
  )
}
