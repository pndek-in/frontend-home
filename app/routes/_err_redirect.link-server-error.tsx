import { useTranslation } from "react-i18next"

export default function LinkInvalid() {
  const { t } = useTranslation("error")

  return (
    <>
      <h1 className=" font-bold text-4xl mb-4">{t("link-server-error")}</h1>
      <p className="">{t("err-link-server-error")}</p>
    </>
  )
}
