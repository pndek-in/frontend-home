import { makeApiRequest } from "./request"
import { ApiResponse, ApiFunction } from "../../types/api"

type UserData = {
  isVerified: boolean
  email: string
  name: string
}

type AuthData = UserData & {
  token: string
}

type TokenData = {
  token: string
}

type AuthResponse = ApiResponse<AuthData>
type TokenResponse = ApiResponse<TokenData>

const loginRequest = async (
  payload: { email: string; password: string },
  api: ApiFunction
): Promise<AuthResponse> => {
  const { email, password } = payload

  return makeApiRequest<AuthData>("/auth/login", api, {
    method: "POST",
    body: JSON.stringify({ email, password })
  })
}

const registerRequest = async (
  payload: { email: string; password: string; name: string },
  api: ApiFunction
): Promise<AuthResponse> => {
  const { email, password, name } = payload

  return makeApiRequest<AuthData>("/auth/register", api, {
    method: "POST",
    body: JSON.stringify({ email, password, name })
  })
}

const googleAuthRequest = async (
  payload: {
    credential: string
    g_csrf_token: string
  },
  api: ApiFunction
): Promise<AuthResponse> => {
  const { credential, g_csrf_token } = payload

  return makeApiRequest<AuthData>("/auth/google-auth", api, {
    method: "POST",
    body: JSON.stringify({ credential, g_csrf_token })
  })
}

const generateTelegramToken = async (
  payload: { token: string },
  api: ApiFunction
): Promise<TokenResponse> => {
  return makeApiRequest<TokenData>("/auth/token/telegram", api, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${payload.token}`
    }
  })
}

const requestVerificationEmail = async (
  payload: { token: string },
  api: ApiFunction
): Promise<ApiResponse<{}>> => {
  return makeApiRequest<{}>("/auth/verify/request", api, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${payload.token}`
    }
  })
}

const verifyEmail = async (
  payload: { token: string },
  api: ApiFunction
): Promise<ApiResponse<{}>> => {
  const url = `/auth/verify/email?token=${payload.token}`
  return makeApiRequest<{}>(url, api, {
    method: "POST"
  })
}

export default {
  loginRequest,
  registerRequest,
  googleAuthRequest,
  generateTelegramToken,
  requestVerificationEmail,
  verifyEmail
}
