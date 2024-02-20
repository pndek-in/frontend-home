import { useEffect } from "react"
import { Form } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

import { Button, Input } from "~/components/shared"

type AuthFormProps = {
  actionData?: {
    errors?: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
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
      <h1 className=" text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
        {type === "login" ? t("login-form-title") : t("register-form-title")}
      </h1>
      <div className=" flex flex-col items-center p-1 sm:p-5">
        <Form id="auth-form" method="post" className=" flex w-full">
          <div className="w-full flex flex-col items-center justify-start">
            {type === "register" ? (
              <Input
                placeholder={t("input-name")}
                name="name"
                type="text"
                className="mb-2"
                isError={!!actionData?.errors?.name}
                errorText={actionData?.errors?.name}
              />
            ) : null}
            <Input
              placeholder={t("input-email")}
              name="email"
              type="email"
              className="mb-2"
              autoComplete="email"
              isError={!!actionData?.errors?.email}
              errorText={actionData?.errors?.email}
            />
            <Input
              placeholder={t("input-password")}
              name="password"
              type="password"
              autoComplete="current-password"
              className="mb-2"
              isError={!!actionData?.errors?.password}
              errorText={actionData?.errors?.password}
            />
            {type === "register" ? (
              <Input
                placeholder={t("input-confirm-password")}
                name="confirmPassword"
                type="password"
                className="mb-2"
                isError={!!actionData?.errors?.confirmPassword}
                errorText={actionData?.errors?.confirmPassword}
              />
            ) : null}
            <Button id="submit-form" type="submit" className="mt-6">
              {type === "login" ? t("login-button") : t("register-button")}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
