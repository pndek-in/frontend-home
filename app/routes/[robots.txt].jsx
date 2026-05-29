export const loader = () => {
  const robotText = `
    User-agent: facebookexternalhit
    Allow: /

    User-agent: Twitterbot
    Allow: /

    User-agent: GPTBot
    Disallow: /

    User-agent: ChatGPT-User
    Disallow: /

    User-agent: Google-Extended
    Disallow: /

    User-agent: anthropic-ai
    Disallow: /

    User-agent: Claude-Web
    Disallow: /

    User-agent: CCBot
    Disallow: /

    User-agent: cohere-ai
    Disallow: /

    User-agent: PerplexityBot
    Disallow: /

    User-agent: Bytespider
    Disallow: /

    User-agent: meta-externalagent
    Disallow: /

    User-agent: *
    Allow: /
    Disallow: /dashboard
    Disallow: /api

    Sitemap: https://pndek.in/sitemap.xml
  `

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
