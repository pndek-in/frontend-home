import { Model, DataTypes, Optional } from "sequelize"
import { sequelize } from "../config/database.server"
import { convertToUnixTimestamp } from "../utils/date.server"

export interface ClickAttributes {
  clickId: number
  linkId: number
  clickedAt: number
  userAgent: string | null
  referrer: string | null
  source: string | null
  visitor: string | null
  city: string | null
  country: string | null
}

interface ClickCreationAttributes
  extends Optional<ClickAttributes, "clickId" | "clickedAt"> {}

export class Click
  extends Model<ClickAttributes, ClickCreationAttributes>
  implements ClickAttributes
{
  declare clickId: number
  declare linkId: number
  declare clickedAt: number
  declare userAgent: string | null
  declare referrer: string | null
  declare source: string | null
  declare visitor: string | null
  declare city: string | null
  declare country: string | null
}

Click.init(
  {
    clickId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    linkId: DataTypes.INTEGER,
    clickedAt: DataTypes.BIGINT,
    userAgent: DataTypes.STRING,
    referrer: DataTypes.STRING,
    source: DataTypes.STRING,
    visitor: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  },
  {
    sequelize,
    modelName: "Click",
    timestamps: false
  }
)

Click.beforeCreate((record) => {
  record.dataValues.clickedAt = convertToUnixTimestamp(new Date())
})
