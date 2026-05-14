import { Model, DataTypes, Optional } from "sequelize"
import { sequelize } from "../config/database.server"
import { convertToUnixTimestamp } from "../utils/date.server"
import { hash } from "../utils/bcrypt.server"

export interface UserAttributes {
  userId: number
  email: string
  name: string
  password: string
  createdAt: number
  updatedAt: number
  isVerified: boolean
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "userId" | "createdAt" | "updatedAt"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare userId: number
  declare email: string
  declare name: string
  declare password: string
  declare createdAt: number
  declare updatedAt: number
  declare isVerified: boolean
}

User.init(
  {
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.INTEGER,
    updatedAt: DataTypes.INTEGER,
    isVerified: DataTypes.BOOLEAN
  },
  {
    sequelize,
    modelName: "User",
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
)

User.beforeCreate(async (record) => {
  const now = new Date()
  record.dataValues.createdAt = convertToUnixTimestamp(now)
  record.dataValues.updatedAt = convertToUnixTimestamp(now)
  record.dataValues.password = await hash(record.dataValues.password)
})

User.beforeBulkUpdate((options: any) => {
  options.attributes.updatedAt = convertToUnixTimestamp(new Date())
})
