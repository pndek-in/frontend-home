export const loader = () => {
  const robotText = `
    User-agent: *
    Disallow: /dashboard
    Allow: /
    Sitemap: https://pndek.in/sitemap.xml
  `

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
