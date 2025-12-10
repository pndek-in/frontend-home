/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "remix-i18next",
    /^remix-utils.*/,
    "jalutils"
  ]
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
}
