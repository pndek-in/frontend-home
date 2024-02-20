import { useTranslation } from "react-i18next"
import { Form, useOutletContext } from "@remix-run/react"
import { useEffect, useRef } from "react"

import { Button, Input, UnclaimedLink } from "~/components/shared"

type HeroProps = {
  isSuccess?: boolean
  linkData?: {
    id: number
    url: string
    path: string
  }
}

export default function Hero({ isSuccess, linkData }: HeroProps) {
  const { t } = useTranslation("home")
  const context = useOutletContext() as any
  const $homeCreateForm = useRef<HTMLFormElement>(null)

  useEffect(
    function resetFormOnSuccess() {
      if (isSuccess) {
        $homeCreateForm.current?.reset()
      }
    },
    [isSuccess]
  )

  return (
    <div className="xl:max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-center xl:space-x-10 min-h-[calc(100vh-64px-60px-136px-80px)]">
      <h1 className=" p-5 text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-200 lg:min-w-[680px]">
        {t("hero-header")}
      </h1>
      <div className=" flex flex-col items-center p-5">
        <h2 className=" text-1xl font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("hero-subheader")}
        </h2>
        {linkData?.id ? (
          <UnclaimedLink linkData={linkData} />
        ) : (
          <Form
            id="shorten-link-form"
            method="post"
            className=" flex w-full flex-col"
            ref={$homeCreateForm}
            reloadDocument
            action={context?.isLoggedIn ? "/dashboard/links" : ""}
          >
            <div className="w-full flex">
              <Input
                placeholder={t("long-link-placeholder", { ns: "common" })}
                name="link"
                variant="group"
              />
              <Button type="submit" name="intent" value="create" isGroup>
                {t("shorten", { ns: "common" })}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}
