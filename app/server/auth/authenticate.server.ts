import { User } from "../models/index.server"
import { decodeToken } from "../utils/jwt.server"
import { MESSAGE } from "../constants/message"
import type { UserAttributes } from "../models/user.server"

export const authenticate = async (token: string | undefined): Promise<UserAttributes> => {
  if (!token) throw { status: 401, message: MESSAGE.INVALID_TOKEN }

  const { userId, email } = decodeToken(token)
  if (!userId || !email) throw { status: 401, message: MESSAGE.INVALID_TOKEN }

  const user = await User.findByPk(userId)
  if (!user || user.email !== email) throw { status: 401, message: MESSAGE.INVALID_TOKEN }

  return user.dataValues as UserAttributes
}

// Used by bot API routes — token carries { tokenType, tokenData } structure
export const authenticateBot = async (token: string | undefined): Promise<UserAttributes> => {
  if (!token) throw { status: 401, message: MESSAGE.INVALID_TOKEN }

  const decoded = decodeToken(token)
  const { tokenType, tokenData } = decoded

  if (!tokenType || !tokenData || !tokenData.id) {
    throw { status: 401, message: MESSAGE.INVALID_TOKEN }
  }
  if (!tokenData.isVerified) {
    throw { status: 401, message: MESSAGE.UNVERIFIED_USER }
  }

  const user = await User.findByPk(tokenData.id)
  if (!user || user.email !== tokenData.email) {
    throw { status: 401, message: MESSAGE.INVALID_TOKEN }
  }
  if (!user.isVerified) {
    throw { status: 401, message: MESSAGE.UNVERIFIED_USER }
  }

  return { ...user.dataValues, tokenType } as UserAttributes
}

// Helper: reads the user JWT token from the userState cookie value
export const getTokenFromCookieUser = (cookieUser: any): string | undefined => {
  return cookieUser?.token
}
