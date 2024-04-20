export const loader = () => {
  const allowedPaths = ["/about", "/privacy-policy", "/terms-of-service"]

  const allows = allowedPaths.map((path) => `Allow: ${path}
    `)

  const robotText = `
    User-agent: *

    Disallow: /

    ${allows.join("")}
    Sitemap: https://pndek.in/sitemap.xml
  `

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
