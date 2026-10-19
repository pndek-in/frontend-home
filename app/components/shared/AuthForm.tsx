import { useEffect } from "react"
import { Form } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import { Button, Input } from "~/components/shared"
import { Alert } from "~/components/ui/alert"

type AuthFormProps = {
  actionData?: {
    errors?: {
      email?: string
      password?: string
      toast?: string
    }
  }
  type: string
}

export default function AuthForm({
  actionData,
  type = "login"
}: AuthFormProps) {
  const { t } = useTranslation("auth")

  useEffect(() => {
    if (actionData?.errors?.toast) {
      toast.error(actionData?.errors?.toast, {
        position: "top-center",
        autoClose: 3000
      })
    }
  }, [actionData])

  return (
    <div className=" text-center">
      <h1 className=" text-2xl sm:text-3xl font-extrabold mb-4 text-fg">
        {type === "login" ? t("login-form-title") : t("register-form-title")}
      </h1>
      {type === "login" ? (
        <div className=" flex flex-col items-center p-1 sm:p-5">
          <Form id="auth-form" method="post" className=" flex w-full">
            <div className="w-full flex flex-col items-stretch justify-start gap-3">
              {actionData?.errors?.toast ? (
                <Alert tone="danger" className="text-left">
                  {actionData.errors.toast}
                </Alert>
              ) : null}
              <Input
                placeholder={t("input-email")}
                name="email"
                type="email"
                autoComplete="email"
                isError={!!actionData?.errors?.email}
                errorText={actionData?.errors?.email}
              />
              <Input
                placeholder={t("input-password")}
                name="password"
                type="password"
                autoComplete="current-password"
                isError={!!actionData?.errors?.password}
                errorText={actionData?.errors?.password}
              />
              <Button id="submit-form" type="submit" isBlock className="mt-3">
                {t("login-button")}
              </Button>
            </div>
          </Form>
        </div>
      ) : null}
    </div>
  )
}
