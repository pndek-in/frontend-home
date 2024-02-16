const API_SERVER = process.env.API_SERVER || "http://localhost:3000"

async function apiHelper(
  endPoint: string,
  options: RequestInit = {},
  server: string = API_SERVER
): Promise<{ status: number; data: any }> {
  try {
    const fullUrl = new URL(endPoint, server).toString()
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    return {
      status: response.status,
      data
    }
  } catch (err) {
    // Re-throw the error with status if available
    if (err instanceof Response) {
      throw { status: err.status, error: err }
    } else {
      throw { status: 500, error: err } // or another default status code
    }
  }
}

export default apiHelper
