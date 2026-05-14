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
import { dateHelper, isUrlValid } from "~/utils/helpers"
import { userState, globalToast, unclaimedLink } from "~/services/cookies.server"
import { authenticate } from "~/server/auth/authenticate.server"
import { authorizeLink } from "~/server/auth/authorize-link.server"
import {
  getLinkList,
  createLink,
  updateLink,
  updateLinkStatus,
  claimLink
} from "~/server/services/link.server"

export const meta: MetaFunction = () => {
  const { t } = useTranslation("meta")

  return [{ title: t("meta-dashboard-link-title") }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  const linkData = (await unclaimedLink.parse(request.headers.get("Cookie"))) || {}
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  if (!(status === "active" || status === "inactive")) {
    return redirect("/dashboard/links?status=active")
  }

  const statusNum = status === "active" ? 1 : 0
  let lists: any[] = []

  try {
    const userData = await authenticate(user.token)
    lists = await getLinkList(userData.userId, statusNum)
  } catch {}

  const masonryLists = {
    left: lists.filter((_: any, i: number) => i % 2 === 0),
    right: lists.filter((_: any, i: number) => i % 2 === 1)
  }

  return json({ lists, masonryLists, status: statusNum, linkData })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = (await userState.parse(request.headers.get("Cookie"))) || {}
  if (!user.token) return redirect("/login")

  const linkData = (await unclaimedLink.parse(request.headers.get("Cookie"))) || {}
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
      await globalToast.serialize({ content: "Please verify your email", type: "error" })
    )
    return redirect("/dashboard/links", { headers })
  }

  try {
    const userData = await authenticate(user.token)

    if (intent === "create") {
      if (!link) {
        headers.append(
          "Set-Cookie",
          await globalToast.serialize({ content: "Link is required!", type: "error" })
        )
        return redirect("/dashboard/links", { headers })
      }

      if (!isUrlValid(link)) {
        headers.append(
          "Set-Cookie",
          await globalToast.serialize({ content: "Link is not valid!", type: "error" })
        )
        return redirect("/dashboard/links", { headers })
      }

      const payload: any = { url: link, description, secretCode }
      if (expiredAt) {
        payload.expiredAt = dateHelper.dateToUnixTimestamp(new Date(expiredAt))
      }

      const response = await createLink(payload, userData.userId)
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: response.message, type: "success" })
      )
    } else if (intent === "edit") {
      const linkId = Number(formData.get("linkId"))
      const path = formData.get("path") as string
      const existingLink = await authorizeLink(linkId, userData.userId)

      const payload: any = { path, description, secretCode }
      if (expiredAt) {
        payload.expiredAt = dateHelper.dateToUnixTimestamp(new Date(expiredAt))
      }

      const response = await updateLink(linkId, existingLink.path, payload)
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: response.message, type: "success" })
      )
    } else if (intent === "archive" || intent === "restore") {
      const linkId = Number(formData.get("linkId"))
      const newStatus = intent === "archive" ? 0 : 1

      const response = await updateLinkStatus(linkId, newStatus)
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: response.message, type: "success" })
      )
    } else if (intent === "claim") {
      const response = await claimLink(linkData.id, userData.userId)
      isSuccessful = true
      headers.append(
        "Set-Cookie",
        await globalToast.serialize({ content: response.message, type: "success" })
      )
      headers.append(
        "Set-Cookie",
        await unclaimedLink.serialize({ id: "" }, { path: "/" })
      )
    }
  } catch (err: any) {
    headers.append(
      "Set-Cookie",
      await globalToast.serialize({ content: err.message, type: "error" })
    )
  }

  return json({ success: isSuccessful }, { headers })
}

export default function DashboardLinks() {
  const { t } = useTranslation("dashboard")
  const navigate = useNavigate()
  const actionData = useActionData<typeof action>()
  const { lists, status, masonryLists, linkData } = useLoaderData<typeof loader>()
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
            { label: t("active-link"), value: 1 },
            { label: t("inactive-link"), value: 0 }
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
