import { Model, DataTypes, Optional } from "sequelize"
import { sequelize } from "../config/database.server"
import { convertToUnixTimestamp } from "../utils/date.server"
import { hash } from "../utils/bcrypt.server"

export interface LinkAttributes {
  linkId: number
  path: string
  url: string
  description: string | null
  source: string | null
  status: number
  expiredAt: number | null
  secretCode: string | null
  userId: number
  totalClick: number
  createdAt: number
  updatedAt: number
}

interface LinkCreationAttributes
  extends Optional<
    LinkAttributes,
    "linkId" | "totalClick" | "createdAt" | "updatedAt"
  > {}

export class Link
  extends Model<LinkAttributes, LinkCreationAttributes>
  implements LinkAttributes
{
  declare linkId: number
  declare path: string
  declare url: string
  declare description: string | null
  declare source: string | null
  declare status: number
  declare expiredAt: number | null
  declare secretCode: string | null
  declare userId: number
  declare totalClick: number
  declare createdAt: number
  declare updatedAt: number
}

Link.init(
  {
    linkId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    path: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    source: DataTypes.STRING,
    status: DataTypes.INTEGER,
    expiredAt: DataTypes.INTEGER,
    secretCode: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    totalClick: DataTypes.INTEGER,
    createdAt: DataTypes.INTEGER,
    updatedAt: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: "Link",
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
)

Link.beforeCreate(async (record) => {
  const now = new Date()
  record.dataValues.createdAt = convertToUnixTimestamp(now)
  record.dataValues.updatedAt = convertToUnixTimestamp(now)
  record.dataValues.totalClick = 0

  if (record.dataValues.secretCode) {
    record.dataValues.secretCode = await hash(record.dataValues.secretCode)
  }
})

Link.beforeBulkUpdate((options: any) => {
  options.attributes.updatedAt = convertToUnixTimestamp(new Date())
})
