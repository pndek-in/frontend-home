import { useTranslation } from "react-i18next"
import { Form } from "@remix-run/react"

import { Button, Input } from "~/components/shared"

type HeroProps = {
  actionData?: {
    errors?: {
      link?: string
    }
  }
}

export default function Hero({ actionData }: HeroProps) {
  const { t } = useTranslation("home")

  return (
    <div className="xl:max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-center xl:space-x-10 min-h-[calc(100vh-64px-60px-136px-80px)]">
      <h1 className=" p-5 text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-200">
        {t("hero-header")}
      </h1>
      <div className=" flex flex-col items-center p-5">
        <h2 className=" text-1xl font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("hero-subheader")}
        </h2>
        <Form id="shorten-link-form" method="post" className=" flex w-full">
          <div className="w-full flex">
            <Input
              placeholder={t("long-link-placeholder", { ns: "common" })}
              name="link"
              variant="group"
            />
            {actionData?.errors?.link ? (
            <em>{actionData?.errors.link}</em>
          ) : null}
            <Button type="submit" isGroup>
              {t("shorten", { ns: "common" })}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
