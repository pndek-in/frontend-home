import { redirect, data } from "@remix-run/node"
import { useParams } from "@remix-run/react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import type {
  ActionFunctionArgs,
  MetaFunction,
  LoaderFunctionArgs
} from "@remix-run/node"
import { useLoaderData, Form } from "@remix-run/react"
import { visitorCookie } from "~/services/cookies.server"
import { fetchMetadata } from "~/services/preview.server"
import API from "~/utils/api"
import { apiHelper } from "~/utils/helpers"
import { Button, Input } from "~/components/shared"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { t } = useTranslation("meta")
  if (!data) {
    return [
      { title: t("meta-home-title") },
      { name: "description", content: t("meta-home-desc") }
    ]
  }

  const { response } = data?.data || {
    response: { url: "", hasSecretCode: false, metaData: null }
  }
  if (response.hasSecretCode) {
    return [
      { title: t("meta-home-title") },
      { name: "description", content: t("meta-home-desc") }
    ]
  } else {
    if (response.metaData) {
      return [
        { title: response.metaData.title },
        { name: "description", content: response.metaData.description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: response.metaData.title },
        { property: "og:description", content: response.metaData.description },
        { property: "og:image", content: response.metaData.image || "" },
        { property: "og:url", content: response.url },
        { property: "twitter:card", content: "summary_large_image" },
        { property: "twitter:title", content: response.metaData.title },
        {
          property: "twitter:description",
          content: response.metaData.description
        },
        { property: "twitter:image", content: response.metaData.image || "" },
        { property: "twitter:url", content: response.url }
      ]
    }

    return [
      { title: t("meta-home-title") },
      { name: "description", content: `Redirect to ${response.url}` }
    ]
  }
}

async function getVisitor(request: Request): Promise<string> {
  const { visitor } =
    (await visitorCookie.parse(request.headers.get("Cookie"))) || {}

  if (visitor) return visitor
  else {
    const now = Date.now()
    const randomString = Math.random().toString(36).substring(2, 7)
    const newVisitor = `${now}${randomString}`

    return newVisitor
  }
}

type Payload = {
  unique: string
  referrer: string | null
  visitor: string
  source: string
  secretCode?: string
}

async function generatePayload(
  request: Request,
  secretCode?: string
): Promise<Payload> {
  const userAgent = request.headers.get("user-agent") || "node-fetch"
  const referrer = request.headers.get("referer")
  const currentUrl = new URL(request.url)
  const sourceQuery = currentUrl.searchParams.get("s") || "web"
  const uniquePath = currentUrl.pathname.split("/").pop() || ""

  const visitor = await getVisitor(request)

  const payload = {
    unique: uniquePath,
    referrer,
    visitor,
    source: sourceQuery,
    secretCode,
    userAgent
  }

  return payload
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const secretCode = formData.get("secretCode") as string | ""
  const payload = await generatePayload(request, secretCode)

  const response = await API.link.redirectLinkRequest(payload, apiHelper)

  // set a cookie for the visitor
  const headers = new Headers()
  headers.append(
    "Set-Cookie",
    await visitorCookie.serialize({
      visitor: payload.visitor
    })
  )

  if (response.status === 200) {
    return redirect(response.data.url, {
      headers
    })
  } else {
    throw new Response("", {
      status: response.status,
      statusText: response.message,
      headers
    })
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const payload = await generatePayload(request)

  const response = await API.link.redirectLinkRequest(payload, apiHelper)

  // set a cookie for the visitor
  const headers = new Headers()
  headers.append(
    "Set-Cookie",
    await visitorCookie.serialize({
      visitor: payload.visitor
    })
  )

  if (response.status === 200) {
    let metaData = null
    if (response.data.url) {
      metaData = await fetchMetadata(response.data.url)
    }

    return data(
      {
        response: {
          url: response.data.url,
          hasSecretCode: response.data.hasSecretCode,
          payload,
          metaData
        }
      },
      {
        headers
      }
    )
  } else {
    throw new Response("", {
      status: response.status,
      statusText: response.message,
      headers
    })
  }
}

export default function Redirect() {
  const { t } = useTranslation("common")
  const params = useParams()
  const unique = params.path
  const { data } = useLoaderData<typeof loader>()

  const COUNTDOWN = 5
  const [countdown, setCountdown] = useState(COUNTDOWN)
  const [redirectFailed, setRedirectFailed] = useState(false)

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Attempt to redirect
      window.location.href = data.response.url

      // Fallback if redirect doesn't happen immediately
      const fallbackTimer = setTimeout(() => setRedirectFailed(true), 2000)
      return () => clearTimeout(fallbackTimer)
    }
  }, [countdown, data.response.url])

  if (!data) {
    return <div>Loading...</div>
  }

  const { response } = data
  if (response.hasSecretCode) {
    return (
      <div className="min-h-[calc(100vh-64px-60px)] flex justify-center items-center">
        <div className=" max-w-96 mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            {t("secret-code-required")}
          </h1>
          <Form
            id="secret-code-form"
            method="post"
            action={`/${unique}`}
            className=" flex w-full flex-col"
          >
            <div className="w-full flex">
              <Input
                placeholder={t("secret-code-placeholder", { ns: "common" })}
                name="secretCode"
                type="password"
                variant="group"
                className="h-full"
              />
              <Button type="submit" isGroup>
                {t("unlock-link", { ns: "common" })}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px-60px)] flex justify-center items-center">
      <div className="max-w-96 mx-auto p-4 text-center">
        <p className="mb-4 text-lg">
          Redirecting to:{" "}
          <a
            href={data.response.url}
            className="font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            {data.response.url}
          </a>
        </p>

        <p className="text-lg font-bold mb-3">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>

        {redirectFailed && (
          <p className="text-gray-500">
            If you are not redirected automatically, please click the link
            above.
          </p>
        )}
      </div>
    </div>
  )
}
