import { makeApiRequest } from "./request"
import { ApiResponse, ApiFunction } from "../../types/api"

type HomeStats = {
  totalUser: number
  totalLink: number
  totalClick: number
}

type HomeStatsResponse = ApiResponse<HomeStats>

type DashboardUserStats = {
  counters: {
    title: string
    value: number
  }[]
  chart: {
    labels: string[]
    data: number[]
  }
  tables: {
    title: string
    column: string
    labels: string[]
    values: number[]
  }[]
}
type DashboardLinkStats = {
  counters: {
    title: string
    value: number
  }[]
  chart: {
    labels: string[]
    data: number[]
  }
  tables: {
    title: string
    column: string
    labels: string[]
    values: number[]
  }[]
  link: {
    path: string
    linkId: number
  }
}

type DashboardUserStatsResponse = ApiResponse<DashboardUserStats>
type DashboardLinkStatsResponse = ApiResponse<DashboardLinkStats>

const getHomeStats = async (api: ApiFunction): Promise<HomeStatsResponse> => {
  return makeApiRequest<HomeStats>("/stats/home", api, {
    method: "GET"
  })
}

const getUserStats = async (
  payload: {
    token: string
    query: string
  },
  api: ApiFunction
): Promise<DashboardUserStatsResponse> => {
  const { token, query } = payload

  return makeApiRequest<DashboardUserStats>(`/stats/user?${query}`, api, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getLinkStats = async (
  payload: {
    id: number
    token: string
    query: string
  },
  api: ApiFunction
): Promise<DashboardLinkStatsResponse> => {
  const { token, query, id } = payload

  return makeApiRequest<DashboardLinkStats>(`/stats/link/${id}?${query}`, api, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default {
  getHomeStats,
  getUserStats,
  getLinkStats
}
