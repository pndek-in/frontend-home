export const loader = () => {
  const robotText = `
    User-agent: facebookexternalhit
    Allow: /

    User-agent: Twitterbot
    Allow: /

    User-agent: *
    Allow: /
    Disallow: /dashboard

    Sitemap: https://pndek.in/sitemap.xml
  `

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
