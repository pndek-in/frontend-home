import { Sequelize } from "sequelize"

declare global {
  var __sequelize: Sequelize | undefined
}

function createSequelize(): Sequelize {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, { dialect: "postgres", logging: false })
  }
  return new Sequelize(
    process.env.DEV_DB_NAME!,
    process.env.DEV_DB_USERNAME!,
    process.env.DEV_DB_PASSWORD!,
    {
      host: process.env.DEV_DB_HOST,
      dialect: "postgres",
      logging: false
    }
  )
}

// Reuse across hot reloads in dev
if (!global.__sequelize) {
  global.__sequelize = createSequelize()
}

export const sequelize = global.__sequelize
