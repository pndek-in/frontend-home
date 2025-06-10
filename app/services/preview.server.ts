import * as cheerio from "cheerio"

export async function fetchMetadata(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (LinkPreviewBot)"
      }
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)

    const getMeta = (name: string) =>
      $(`meta[name="${name}"]`).attr("content") ||
      $(`meta[property="${name}"]`).attr("content")

    return {
      title: $("title").text() || getMeta("og:title"),
      description: getMeta("description") || getMeta("og:description"),
      image: getMeta("og:image") || getMeta("twitter:image"),
      url
    }
  } catch (err) {
    console.error("Failed to fetch meta:", err)
    return null
  }
}
