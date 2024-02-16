type ApiResponse<T> = {
  status: number
  message: string
  data: T
}

type ApiFunction = (endpoint: string, options?: RequestInit) => Promise<any>

export type {
  ApiResponse,
  ApiFunction
} 