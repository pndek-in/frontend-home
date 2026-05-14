// Used by sequelize-cli only. Env vars are pre-loaded by dotenv-cli in npm scripts.
module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
}
