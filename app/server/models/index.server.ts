import { sequelize } from "../config/database.server"
import { User } from "./user.server"
import { Link } from "./link.server"
import { Click } from "./click.server"

// Associations
User.hasMany(Link, { foreignKey: "userId" })
Link.belongsTo(User, { foreignKey: "userId" })
Link.hasMany(Click, { foreignKey: "linkId" })
Click.belongsTo(Link, { foreignKey: "linkId" })

export { sequelize, User, Link, Click }
