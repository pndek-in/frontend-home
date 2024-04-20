export const loader = () => {
  const paths = ["about", "privacy-policy", "terms-of-service"]

  const urls = paths.map(
    (path) => `
  <url>
    <loc>https://pndek.in/${path}</loc>
    <changefreq>weekly</changefreq>
  </url>
  `
  )

  const content = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pndek.in</loc>
    <lastmod>2024-14-20T00:00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${urls.join("")}
  </urlset>
  `

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8"
    }
  })
}
