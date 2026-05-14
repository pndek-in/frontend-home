import { Op } from "sequelize"
import { randomize } from "string-randomify"
import { WebServiceClient } from "@maxmind/geoip2-node"
import { isbot } from "isbot"
import { Link, Click } from "../models/index.server"
import { STATUS, PATH } from "../constants/status"
import { PATH as UNAUTHORIZED_PATHS } from "../constants/path"
import {
  convertToUnixTimestamp,
  compareUnixTimestamp
} from "../utils/date.server"
import { compareHash, hash } from "../utils/bcrypt.server"
import { isURLSafe, appendHttps, isURLValid } from "../utils/url.server"
import { updateRedis } from "./redis.server"

export const getLinkList = async (userId: number, status: number) => {
  const links = await Link.findAll({
    where: { userId, status },
    attributes: [
      "linkId",
      "url",
      "path",
      "description",
      "status",
      "expiredAt",
      "userId",
      "createdAt",
      "secretCode",
      "totalClick"
    ],
    order: [["createdAt", "DESC"]]
  })

  return links.map((link) => ({
    linkId: link.linkId,
    url: link.url,
    path: link.path,
    description: link.description,
    status: link.status,
    expiredAt: link.expiredAt,
    userId: link.userId,
    createdAt: link.createdAt,
    totalClick: link.totalClick,
    hasSecretCode: !!link.secretCode
  }))
}

export const getLinkDetail = async (
  id: number,
  start: number,
  end: number
) => {
  const link = await Link.findOne({
    where: { linkId: id },
    attributes: [
      "linkId",
      "url",
      "path",
      "title",
      "status",
      "expiredAt",
      "userId",
      "createdAt",
      "secretCode",
      "totalClick"
    ]
  })

  if (!link) throw { status: 404, message: "Link is not found" }

  const clicks = await Click.findAll({
    where: {
      linkId: id,
      clickedAt: { [Op.between]: [start, end] }
    },
    attributes: [
      "clickId",
      "linkId",
      "clickedAt",
      "userAgent",
      "referrer",
      "source",
      "visitor"
    ]
  })

  const visitors: string[] = []
  clicks.forEach((click) => {
    if (click.visitor && !visitors.includes(click.visitor))
      visitors.push(click.visitor)
  })

  const totalFromQr = clicks.filter((c) => c.source === "qr").length

  return {
    linkId: link.linkId,
    url: link.url,
    path: link.path,
    status: link.status,
    expiredAt: link.expiredAt,
    userId: link.userId,
    createdAt: link.createdAt,
    hasSecretCode: !!link.secretCode,
    totalClick: link.totalClick,
    uniqueVisitor: visitors.length,
    totalFromQr,
    clicks
  }
}

const generateRandomPath = async (): Promise<string> => {
  const randomString = randomize(5)
  const existing = await Link.findOne({
    where: { path: randomString },
    attributes: ["path"]
  })
  if (existing || UNAUTHORIZED_PATHS.UNAUTHORIZED.includes(randomString)) {
    return generateRandomPath()
  }
  return randomString
}

const createLinkHelper = async (payload: {
  url: string
  description?: string | null
  expiredAt?: number | null
  secretCode?: string | null
  status: number
  userId: number
  source: string
}) => {
  const { url, description, expiredAt, secretCode, status, userId, source } =
    payload

  if (!url) throw { status: 400, message: "Original URL is required" }

  const isUrlSafe = await isURLSafe(url)
  if (!isUrlSafe) throw { status: 400, message: "URL is not safe" }

  const urlValid = isURLValid(url)
  if (!urlValid) throw { status: 400, message: "URL is not valid" }

  const path = await generateRandomPath()

  const newLink = await Link.create({
    url: appendHttps(url),
    path,
    description: description ?? null,
    expiredAt: expiredAt ?? null,
    secretCode: secretCode ?? null,
    status,
    userId,
    source
  })

  updateRedis("totalLink")
  return newLink
}

const formatLinkResponse = (link: Link) => ({
  linkId: link.linkId,
  url: link.url,
  path: link.path,
  description: link.description,
  status: link.status,
  expiredAt: link.expiredAt,
  userId: link.userId,
  createdAt: link.createdAt,
  hasSecretCode: !!link.secretCode
})

export const createLink = async (
  payload: {
    url: string
    description?: string
    expiredAt?: number
    secretCode?: string
  },
  userId: number,
  source = "web"
) => {
  const newLink = await createLinkHelper({
    ...payload,
    status: STATUS.ACTIVE,
    userId,
    source
  })
  return { message: "Link is successfully created", data: formatLinkResponse(newLink) }
}

export const createLinkWithoutAuth = async (
  payload: { url: string; description?: string; expiredAt?: number; secretCode?: string },
  source = "web"
) => {
  const newLink = await createLinkHelper({
    ...payload,
    status: STATUS.ACTIVE,
    userId: 1,
    source
  })
  return { message: "Link is successfully created", data: formatLinkResponse(newLink) }
}

export const claimLink = async (id: number, userId: number) => {
  const link = await Link.findByPk(id)
  if (!link) throw { status: 404, message: "Link not found" }
  if (link.userId !== 1) throw { status: 400, message: "Link is already claimed" }

  const updated = await Link.update(
    { userId },
    { where: { linkId: id }, returning: true }
  )
  const updatedLink = (updated[1] as any)[0]
  return { message: "Link is successfully claimed", data: formatLinkResponse(updatedLink) }
}

export const updateLink = async (
  id: number,
  existingPath: string,
  payload: {
    description?: string
    expiredAt?: number
    secretCode?: string
    path?: string
  }
) => {
  const { description, expiredAt, secretCode, path } = payload
  const updatePayload: Record<string, any> = { description, expiredAt }

  if (path && path !== existingPath) {
    const isPathExist = await Link.findOne({ where: { path }, attributes: ["path"] })
    if (isPathExist) throw { status: 400, message: "New path is already taken" }
    if (UNAUTHORIZED_PATHS.UNAUTHORIZED.includes(path)) {
      throw { status: 400, message: "New path is not allowed to use" }
    }
    if (!isURLValid(`pndek.in/${path}`)) {
      throw { status: 400, message: "New path is not valid" }
    }
    updatePayload.path = path
  }

  if (secretCode) {
    updatePayload.secretCode = await hash(secretCode)
  }

  const updated = await Link.update(updatePayload, {
    where: { linkId: id },
    returning: true
  })
  const updatedLink = (updated[1] as any)[0]
  return { message: "URL is successfully updated", data: formatLinkResponse(updatedLink) }
}

export const updateLinkStatus = async (id: number, status: number) => {
  const updated = await Link.update(
    { status },
    { where: { linkId: id }, returning: true }
  )
  const updatedLink = (updated[1] as any)[0]
  return { message: "URL status is successfully updated", data: formatLinkResponse(updatedLink) }
}

const insertClickData = async ({
  link,
  userAgent,
  referrer,
  source,
  visitor,
  ipAddress
}: {
  link: { linkId: number; totalClick: number }
  userAgent: string
  referrer: string | null
  source: string
  visitor: string
  ipAddress: string
}) => {
  let country = "N/A"
  let city = "N/A"

  try {
    const client = new WebServiceClient(
      process.env.GEOLITE_ACCOUNT_ID!,
      process.env.GEOLITE_LICENSE_KEY!,
      { host: "geolite.info" }
    )
    const ip = ipAddress.includes(",")
      ? ipAddress.split(",")[0].trim()
      : ipAddress
    const geo = await client.city(ip)
    country = geo?.country?.names?.en || "N/A"
    city = geo?.city?.names?.en || "N/A"
  } catch (err) {
    console.log(err, " | error from geolite")
  }

  Click.create({ linkId: link.linkId, userAgent, referrer, source, visitor, country, city })
  updateRedis("totalClick")
  Link.update(
    { totalClick: link.totalClick + 1 },
    { where: { linkId: link.linkId } }
  )
}

export const findUniqueLink = async ({
  path,
  unlock,
  body,
  userAgent,
  ipAddress
}: {
  path: string
  unlock: boolean
  body: {
    referrer: string | null
    source: string
    secretCode?: string
    visitor: string
  }
  userAgent: string
  ipAddress: string
}) => {
  const link = await Link.findOne({
    where: { path },
    attributes: ["linkId", "url", "expiredAt", "secretCode", "totalClick", "status"]
  })

  if (!link) throw { status: 404, message: "Link is not found" }
  if (link.status !== 1) throw { status: 410, message: "Link is inactive" }

  let hasSecretCode = !!link.secretCode
  const now = convertToUnixTimestamp(new Date())

  if (link.expiredAt && compareUnixTimestamp(now, link.expiredAt) === 1) {
    throw { status: 410, message: "Link is expired" }
  }

  const { referrer, source, secretCode, visitor } = body

  if (hasSecretCode) {
    if (unlock) {
      if (!secretCode) {
        throw { status: 400, message: "Secret code is required" }
      }
      const isValid = await compareHash(secretCode, link.secretCode!)
      if (!isValid) {
        throw { status: 400, message: "Secret code is invalid" }
      }
      hasSecretCode = false
      if (!isbot(userAgent)) {
        insertClickData({ link, userAgent, referrer, source, visitor, ipAddress })
      }
    }
  } else {
    if (!isbot(userAgent)) {
      insertClickData({ link, userAgent, referrer, source, visitor, ipAddress })
    }
  }

  return {
    message: "URL is successfully retrieved",
    data: {
      url: hasSecretCode ? null : link.url,
      expiredAt: link.expiredAt,
      hasSecretCode
    }
  }
}
