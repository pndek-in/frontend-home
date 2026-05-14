import jwt from "jsonwebtoken"
import { MESSAGE } from "../constants/message"

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!)
}

export const decodeToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    throw { status: 401, message: MESSAGE.INVALID_TOKEN }
  }
}
