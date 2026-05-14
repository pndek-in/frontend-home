import { OAuth2Client } from "google-auth-library"
import { randomize } from "string-randomify"
import { User } from "../models/index.server"
import { compareHash, hash } from "../utils/bcrypt.server"
import { generateToken, decodeToken } from "../utils/jwt.server"
import { transporter } from "../config/nodemailer.server"
import { updateRedis } from "./redis.server"

const sendVerificationEmail = ({
  user,
  email
}: {
  user: { userId: number; name: string; email: string }
  email: string
}) => {
  const mailToken = generateToken({
    tokenType: "email",
    tokenData: { id: user.userId, email: user.email }
  })

  const message = `
Hello, ${user.name}! Please verify your email address by clicking the link below:

https://app.pndek.in/verify?t=${mailToken}

If you didn't create an account with us, please ignore this email.
`

  transporter.sendMail(
    {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Verify your email address to access our service at pndek.in",
      text: message,
      replyTo: process.env.SMTP_EMAIL
    },
    (err) => {
      if (err) console.log(err, " | error from nodemailer")
      else console.log("Email sent!")
    }
  )
}

export const verifyEmail = async (token: string) => {
  const { tokenType, tokenData } = decodeToken(token)

  if (tokenType !== "email" || !tokenData.email || !tokenData.id) {
    throw { status: 400, message: "Invalid token" }
  }

  const user = await User.findOne({
    where: { email: tokenData.email },
    attributes: ["userId", "email", "isVerified"]
  })

  if (
    !user ||
    user.userId !== tokenData.id ||
    user.email !== tokenData.email ||
    user.isVerified
  ) {
    throw { status: 400, message: "Invalid token" }
  }

  await User.update({ isVerified: true }, { where: { userId: user.userId } })
  return { message: "Email is successfully verified" }
}

export const requestVerifEmail = async (userData: {
  userId: number
  name: string
  email: string
}) => {
  sendVerificationEmail({ user: userData, email: userData.email })
  return { message: "Verification email is successfully sent" }
}

export const register = async (payload: {
  email: string
  password: string
  name: string
}) => {
  const { email, password, name } = payload

  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" }
  }

  try {
    const user = await User.create({ email, password, name, isVerified: false })
    const token = generateToken({ userId: user.userId, email: user.email })

    sendVerificationEmail({ user, email })
    updateRedis("totalUser")

    return {
      message: "User is successfully created",
      data: {
        isVerified: user.isVerified,
        email: user.email,
        name: user.name,
        token
      }
    }
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw { status: 400, message: "Email is already registered" }
    }
    throw error
  }
}

export const login = async (payload: {
  email: string
  password: string
}) => {
  const { email, password } = payload

  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" }
  }

  const user = await User.findOne({
    where: { email },
    attributes: ["userId", "email", "password", "name", "isVerified"]
  })

  if (!user) {
    throw { status: 400, message: "Invalid email or password!" }
  }

  const comparedPassword = await compareHash(password, user.password)
  if (!comparedPassword) {
    throw { status: 400, message: "Invalid email or password!" }
  }

  const token = generateToken({ userId: user.userId, email: user.email })
  return {
    message: "Login is successful",
    data: {
      isVerified: user.isVerified,
      email: user.email,
      name: user.name,
      token
    }
  }
}

export const googleAuth = async (credential: string) => {
  const client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  const payload = ticket.getPayload()!
  const { email, name } = payload

  const existingUser = await User.findOne({
    where: { email },
    attributes: ["userId", "email", "password", "name", "isVerified"]
  })

  if (existingUser) {
    const token = generateToken({
      userId: existingUser.userId,
      email: existingUser.email
    })
    if (!existingUser.isVerified) {
      User.update({ isVerified: true }, { where: { userId: existingUser.userId } })
    }
    return {
      message: "Login is successful",
      data: {
        isVerified: true,
        email: existingUser.email,
        name: existingUser.name,
        token
      }
    }
  }

  const hashedPassword = await hash(randomize(8))
  const newUser = await User.create({
    email: email!,
    password: hashedPassword,
    name: name!,
    isVerified: true
  })
  const token = generateToken({ userId: newUser.userId, email: newUser.email })

  updateRedis("totalUser")

  return {
    message: "User is successfully created",
    data: {
      isVerified: newUser.isVerified,
      email: newUser.email,
      name: newUser.name,
      token
    }
  }
}

export const getMe = (userData: { userId: number; isVerified: boolean }) => {
  return {
    message: "Get user data is successful",
    data: { isVerified: userData.isVerified, id: userData.userId }
  }
}

export const generateTelegramToken = (userData: {
  userId: number
  isVerified: boolean
  email: string
}) => {
  const token = generateToken({
    tokenType: "telegram",
    tokenData: {
      id: userData.userId,
      isVerified: userData.isVerified,
      email: userData.email
    }
  })
  return { message: "Token is successfully generated", data: { token } }
}
