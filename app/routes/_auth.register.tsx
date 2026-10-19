import type { MetaFunction } from "@remix-run/node"
import { useTranslation } from "react-i18next"

import { AuthForm } from "~/components/shared"

export const handle = {
  i18n: ["meta"]
}

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [
    { title: t("meta-register-title") },
    { name: "description", content: t("meta-register-desc") }
  ]
}

export default function Register() {
  return <AuthForm type="register" />
}
