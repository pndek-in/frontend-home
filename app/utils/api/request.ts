import { ApiResponse, ApiFunction } from "../../types/api"

const makeApiRequest = async <T>(
  endpoint: string,
  api: ApiFunction,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  const response = await api(endpoint, options)
  return {
    status: response.status,
    ...response.data
  }
}

export { makeApiRequest }
