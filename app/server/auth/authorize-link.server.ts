import { Link } from "../models/index.server"
import type { LinkAttributes } from "../models/link.server"

export const authorizeLink = async (
  linkId: number,
  userId: number
): Promise<LinkAttributes> => {
  const link = await Link.findByPk(linkId)
  if (!link) throw { status: 404, message: "Link not found" }
  if (link.userId !== userId) throw { status: 401, message: "Unauthorized" }
  return link.dataValues as LinkAttributes
}
