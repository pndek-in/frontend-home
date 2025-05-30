import { makeApiRequest } from "./request"
import { ApiResponse, ApiFunction } from "../../types/api"

type LinkData = {
  linkId: number
  url: string
  path: string
  description: string
  status: number
  expiredAt: string | null
  createdAt: string
  userId: number
  hasSecretCode: boolean
  totalClick?: number
}

type LinkResponse = ApiResponse<LinkData>
type LinkListResponse = ApiResponse<LinkData[]>

const createLinkRequest = async (
  payload: {
    url: string
    description?: string
    expiredAt?: number
    secretCode?: string
    token: string
  },
  api: ApiFunction
): Promise<LinkResponse> => {
  const { url, description, expiredAt, secretCode, token } = payload

  return makeApiRequest<LinkData>("/link/create", api, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ url, description, expiredAt, secretCode })
  })
}

const getLinkListRequest = async (
  payload: {
    token: string
    status: number
  },
  api: ApiFunction
): Promise<LinkListResponse> => {
  const { token, status } = payload

  return makeApiRequest<LinkData[]>(`/link/lists?status=${status}`, api, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const archiveUnarchiveLinkRequest = async (
  payload: {
    linkId: number
    token: string
    status: number
  },
  api: ApiFunction
): Promise<LinkResponse> => {
  const { linkId, token, status } = payload

  return makeApiRequest<LinkData>(`/link/status/${linkId}`, api, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
}

const editLinkRequest = async (
  payload: {
    linkId: number
    path: string
    description?: string
    expiredAt?: number
    secretCode?: string
    token: string
  },
  api: ApiFunction
): Promise<LinkResponse> => {
  const { linkId, path, description, expiredAt, secretCode, token } = payload

  return makeApiRequest<LinkData>(`/link/edit/${linkId}`, api, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ path, description, expiredAt, secretCode })
  })
}

const createLinkWithoutAuthRequest = async (
  payload: {
    url: string
  },
  api: ApiFunction
): Promise<LinkResponse> => {

  return makeApiRequest<LinkData>("/link/noauth/create", api, {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

const claimLinkRequest = async (
  payload: {
    id: number
    token: string
  },
  api: ApiFunction
): Promise<LinkResponse> => {

  return makeApiRequest<LinkData>(`/link/noauth/claim`, api, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${payload.token}`
    },
    body: JSON.stringify({ id: payload.id })
  })
}

const redirectLinkRequest = async (
  payload: {
    unique: string,
    visitor: string,
    source: string,
    referrer: string | null,
    secretCode?: string
  },
  api: ApiFunction,
): Promise<LinkResponse> => {
  const { unique, secretCode, referrer, visitor, source } = payload
  const query = secretCode ? "?unlock=true" : ""

  const body = {
    referrer,
    visitor,
    source,
    secretCode
  }

  return makeApiRequest<LinkData>(`/link/short/${unique}${query}`, api, {
    method: "POST",
    body: JSON.stringify(body)
  })
}

export default {
  createLinkRequest,
  getLinkListRequest,
  archiveUnarchiveLinkRequest,
  editLinkRequest,
  createLinkWithoutAuthRequest,
  claimLinkRequest,
  redirectLinkRequest
}
