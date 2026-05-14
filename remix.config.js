/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "remix-i18next",
    /^remix-utils.*/,
    "jalutils",
    "string-randomify",
    "isbot"
  ]
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
}
