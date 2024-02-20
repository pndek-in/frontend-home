import { json, redirect } from "@remix-run/node"
import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs
} from "@remix-run/node"
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify-icon/react"
import { Segmented } from "antd"
import { useState } from "react"

import { Dashboard } from "~/components"
import { UnclaimedLink } from "~/components/shared"
import { apiHelper, dateHelper, isUrlValid } from "~/utils/helpers"
import {
  userState,
  globalToast,
  unclaimedLink
} from "~/services/cookies.server"
import API from "~/utils/api"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-link-title") }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const linkData =
    (await unclaimedLink.parse(request.headers.get("Cookie"))) || {}
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  let links = [] as any
  let lists = [] as any

  const response = await API.link.getLinkListRequest(
    {
      token: user.token,
      status: status === "active" ? 1 : 0
    },
    apiHelper
  )

  if (response.status === 200) {
    links = response.data
  }

  if (!(status === "active" || status === "inactive")) {
    return redirect("/dashboard/links?status=active")
  } else {
    lists = links.filter((link: any) => {
      if (status === "active") {
        return link.status === 1
      } else {
        return link.status === 0
      }
    })
  }

  const masonryLists = {
    left: lists.filter((_: any, i: number) => i % 2 === 0),
    right: lists.filter((_: any, i: number) => i % 2 === 1)
  }

  return json({
    lists,
    masonryLists,
    status: status === "active" ? 1 : 0,
    linkData
  })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}

  if (!user.token) {
    redirect("/login")
  }

  const linkData =
    (await unclaimedLink.parse(request.headers.get("Cookie"))) || {}
  const headers = new Headers()
  const formData = await request.formData()
  const intent = formData.get("intent")
  const link = formData.get("link") as string
  const description = formData.get("description") as string
  const expiredAt = formData.get("expiredAt") as string
  const secretCode = formData.get("secretCode") as string

  let isSuccessful = false

  if ((intent === "edit" || intent === "archive") && !user.isVerified) {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({
        content: "Please verify your email",
        type: "error"
      })
    )

    return redirect("/dashboard/links", {
      headers
    })
  }

  if (intent === "create") {
    if (!link) {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: "Link is required!",
          type: "error"
        })
      )

      return redirect("/dashboard/links", {
        headers
      })
    }

    if (isUrlValid(link) === false) {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: "Link is not valid!",
          type: "error"
        })
      )

      return redirect("/dashboard/links", {
        headers
      })
    }

    const payload = {
      url: link,
      description,
      secretCode,
      token: user.token
    } as any

    if (expiredAt) {
      payload["expiredAt"] = dateHelper.dateToUnixTimestamp(
        new Date(expiredAt)
      ) as number
    }

    const response = await API.link.createLinkRequest(payload, apiHelper)

    if (response.status === 201) {
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "success"
        })
      )
    } else {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "error"
        })
      )
    }
  } else if (intent === "edit") {
    const linkId = formData.get("linkId") as string
    const path = formData.get("path") as string
    const payload = {
      linkId: +linkId,
      token: user.token,
      path: path,
      description,
      secretCode
    } as any

    if (expiredAt) {
      payload["expiredAt"] = dateHelper.dateToUnixTimestamp(
        new Date(expiredAt)
      ) as number
    }

    const response = await API.link.editLinkRequest(payload, apiHelper)

    if (response.status === 200) {
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "success"
        })
      )
    } else {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "error"
        })
      )
    }
  } else if (intent === "archive" || intent === "restore") {
    const linkId = formData.get("linkId") as string
    const payload = {
      linkId: +linkId,
      token: user.token,
      status: intent === "archive" ? 0 : 1
    } as any

    const response = await API.link.archiveUnarchiveLinkRequest(
      payload,
      apiHelper
    )

    if (response.status === 200) {
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "success"
        })
      )
    } else {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "error"
        })
      )
    }
  } else if (intent === "claim") {
    const payload = {
      id: linkData.id,
      token: user.token
    }

    const response = await API.link.claimLinkRequest(payload, apiHelper)

    if (response.status === 200) {
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "success"
        })
      )
    } else {
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({
          content: response.message,
          type: "error"
        })
      )
    }

    if (response.status !== 401) {
      headers.append(
        "Set-Cookie",
        await unclaimedLink.serialize({ id: "" }, { path: "/" })
      )
    }

  }

  return json({ success: isSuccessful }, { headers })
}

export default function DashboardLinks() {
  const { t } = useTranslation("dashboard")
  const navigate = useNavigate()
  const actionData = useActionData<typeof action>()
  const { lists, status, masonryLists, linkData } =
    useLoaderData<typeof loader>()
  const isSuccess = actionData?.success

  const [activeSegment, setActiveSegment] = useState(status)

  const changeTab = (value: number) => {
    const s = value === 1 ? "active" : "inactive"
    setActiveSegment(value)
    navigate(`/dashboard/links?status=${s}`)
  }

  return (
    <>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-md h-full mb-4">
        <Icon icon="line-md:external-link" className=" text-2xl sm:text-4xl" />
        <h1 className=" text-2xl sm:text-4xl font-semibold">{t("links")}</h1>
      </div>
      <div className="mb-4">
        <Segmented
          block
          size="large"
          options={[
            {
              label: t("active-link"),
              value: 1
            },
            {
              label: t("inactive-link"),
              value: 0
            }
          ]}
          value={activeSegment}
          onChange={(value) => changeTab(+value)}
        />
      </div>
      <Dashboard.CreateForm isReset={isSuccess} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="hidden lg:flex flex-col space-y-4">
          {linkData?.id && <UnclaimedLink linkData={linkData} />}
          {masonryLists.left.map((data: any, i: number) => (
            <Dashboard.LinkCard key={i} data={data} isSuccess={isSuccess} />
          ))}
        </div>
        <div className="hidden lg:flex flex-col space-y-4">
          {masonryLists.right.map((data: any, i: number) => (
            <Dashboard.LinkCard key={i} data={data} isSuccess={isSuccess} />
          ))}
        </div>
        <div className="lg:hidden flex flex-col space-y-4">
          {linkData?.id && <UnclaimedLink linkData={linkData} />}
          {lists.map((data: any, i: number) => (
            <Dashboard.LinkCard key={i} data={data} isSuccess={isSuccess} />
          ))}
        </div>
      </div>
    </>
  )
}
