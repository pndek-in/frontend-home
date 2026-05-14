import { Op } from "sequelize"
import dayjs from "dayjs"
import UAParser from "ua-parser-js"
import { Link, Click } from "../models/index.server"
import { getRedis } from "./redis.server"
import { sortObjectByValue } from "../utils/object.server"

export const getHomeStats = async () => {
  const totalUser = (await getRedis("totalUser")) || 0
  const totalLink = (await getRedis("totalLink")) || 0
  const totalClick = (await getRedis("totalClick")) || 0

  return {
    message: "Stats is successfully retrieved",
    data: {
      totalUser: Number(totalUser),
      totalLink: Number(totalLink),
      totalClick: Number(totalClick)
    }
  }
}

const assignCountersStats = ({
  links,
  totalClicksAllTime,
  totalClicksPeriod,
  uniqueVisitor,
  qrCodeVisits,
  isUserStats,
  activeLink,
  createdUsingTelegram
}: {
  links: any[]
  totalClicksAllTime: number
  totalClicksPeriod: number
  uniqueVisitor: Record<string, number>
  qrCodeVisits: number
  isUserStats: boolean
  activeLink: number
  createdUsingTelegram: number
}) => {
  const counters: { title: string; value: number }[] = []

  if (isUserStats) {
    counters.push(
      { title: "total-created-links", value: links.length },
      { title: "total-active-links", value: activeLink }
    )
  }

  counters.push(
    { title: "total-clicks-all-time", value: totalClicksAllTime },
    { title: "total-clicks-period", value: totalClicksPeriod },
    { title: "unique-visitors", value: Object.keys(uniqueVisitor).length },
    { title: "qr-code-visits", value: qrCodeVisits }
  )

  if (isUserStats) {
    counters.push({ title: "created-using-telegram", value: createdUsingTelegram })
  }

  return counters
}

const assignChartStats = ({
  chartData,
  start,
  end
}: {
  chartData: Record<string, number>
  start: number
  end: number
}) => {
  const labels: string[] = []
  const data: number[] = []
  const list: Record<string, number> = {}

  let current = dayjs.unix(start)
  const endDate = dayjs.unix(end)
  while (current.isBefore(endDate)) {
    list[current.format("YYYY-MM-DD")] = 0
    current = current.add(1, "day")
  }

  const merged = { ...list, ...chartData }
  Object.keys(merged).forEach((date) => {
    labels.push(dayjs(date).format("DD MMM"))
    data.push(chartData[date] || 0)
  })

  return { labels, data }
}

const assignTablesStats = ({
  linkData,
  countryData,
  cityData,
  isUserStats,
  referrerData,
  browserData,
  deviceData,
  osData
}: {
  linkData: Record<string, number>
  countryData: Record<string, number>
  cityData: Record<string, number>
  isUserStats: boolean
  referrerData: Record<string, number>
  browserData: Record<string, number>
  deviceData: Record<string, number>
  osData: Record<string, number>
}) => {
  const results: {
    title: string
    column: string
    labels: string[]
    values: number[]
  }[] = []
  const limit = 5

  if (isUserStats) {
    const sorted = sortObjectByValue(linkData)
    results.push({
      title: "most-clicked-links",
      column: "short-url",
      labels: Object.keys(sorted).slice(0, limit),
      values: Object.values(sorted).slice(0, limit)
    })
  }

  const tables: [string, string, Record<string, number>][] = [
    ["clicks-by-country", "country", countryData],
    ["clicks-by-city", "city", cityData],
    ["clicks-by-referrer", "referrer", referrerData],
    ["clicks-by-browser", "browser", browserData],
    ["clicks-by-device", "device", deviceData],
    ["clicks-by-os", "os", osData]
  ]

  tables.forEach(([title, column, rawData]) => {
    const sorted = sortObjectByValue(rawData)
    results.push({
      title,
      column,
      labels: Object.keys(sorted).slice(0, limit),
      values: Object.values(sorted).slice(0, limit)
    })
  })

  return results
}

const parseLists = ({
  links,
  start,
  end,
  isUserStats
}: {
  links: any[]
  start: number
  end: number
  isUserStats: boolean
}) => {
  let totalClicksAllTime = 0
  let totalClicksPeriod = 0
  let uniqueVisitor: Record<string, number> = {}
  let qrCodeVisits = 0
  let activeLink = 0
  let createdUsingTelegram = 0
  const chartData: Record<string, number> = {}
  const linkData: Record<string, number> = {}
  const countryData: Record<string, number> = {}
  const cityData: Record<string, number> = {}
  const referrerData: Record<string, number> = {}
  const browserData: Record<string, number> = {}
  const deviceData: Record<string, number> = {}
  const osData: Record<string, number> = {}

  links.forEach((link) => {
    totalClicksAllTime += link.totalClick
    totalClicksPeriod += link.Clicks.length

    if (link.Clicks.length > 0) linkData[link.path] = link.Clicks.length
    if (link.status === 1) activeLink++
    if (link.source === "telegram") createdUsingTelegram++

    link.Clicks.forEach((click: any) => {
      uniqueVisitor[click.visitor] = (uniqueVisitor[click.visitor] || 0) + 1
      if (click.source === "qr") qrCodeVisits++

      const date = dayjs.unix(click.clickedAt).format("YYYY-MM-DD")
      chartData[date] = (chartData[date] || 0) + 1

      if (click.country) countryData[click.country] = (countryData[click.country] || 0) + 1
      if (click.city) cityData[click.city] = (cityData[click.city] || 0) + 1

      if (click.referrer) {
        let ref = click.referrer
        if (ref.includes("//")) ref = ref.split("//")[1]
        referrerData[ref] = (referrerData[ref] || 0) + 1
      }

      const { browser, device, os } = new UAParser(click.userAgent).getResult()
      const browserName = browser?.name || "N/A"
      const deviceType = device?.type || "desktop"
      const osName = os?.name || "N/A"
      browserData[browserName] = (browserData[browserName] || 0) + 1
      deviceData[deviceType] = (deviceData[deviceType] || 0) + 1
      osData[osName] = (osData[osName] || 0) + 1
    })
  })

  return {
    counters: assignCountersStats({
      links,
      totalClicksAllTime,
      totalClicksPeriod,
      uniqueVisitor,
      qrCodeVisits,
      isUserStats,
      activeLink,
      createdUsingTelegram
    }),
    chart: assignChartStats({ chartData, start, end }),
    tables: assignTablesStats({
      linkData,
      countryData,
      cityData,
      isUserStats,
      referrerData,
      browserData,
      deviceData,
      osData
    })
  }
}

export const getUserStats = async (
  userId: number,
  start: number,
  end: number
) => {
  const links = await Link.findAll({
    where: { userId },
    include: [
      {
        model: Click,
        required: false,
        where: { clickedAt: { [Op.between]: [start, end] } }
      }
    ]
  })

  const result = parseLists({ links, start, end, isUserStats: true })
  return { message: "Stats is successfully retrieved", data: result }
}

export const getLinkStats = async (
  linkId: number,
  start: number,
  end: number
) => {
  const link = await Link.findOne({
    where: { linkId },
    include: [
      {
        model: Click,
        required: false,
        where: { clickedAt: { [Op.between]: [start, end] } }
      }
    ]
  })

  if (!link) throw { status: 404, message: "Link is not found" }

  const result = parseLists({ links: [link], start, end, isUserStats: false })
  return {
    message: "Stats is successfully retrieved",
    data: { ...result, link: { path: link.path } }
  }
}
