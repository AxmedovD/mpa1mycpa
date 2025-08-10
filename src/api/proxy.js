import { API_URL } from '../config/api'

/**
 * Proxy for Uzum API requests to avoid CORS issues
 * This endpoint forwards requests to the Uzum API and returns the response
 */
export async function proxyUzumRequest(url, token) {
  try {
    console.log(`Proxying request to: ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return {
        status: false,
        message: 'Error from Uzum API',
        data: errorData
      }
    }
    
    const data = await response.json()
    return {
      status: true,
      data: data
    }
  } catch (error) {
    console.error('Error in proxy request:', error)
    return {
      status: false,
      message: error.message || 'Failed to proxy request to Uzum API'
    }
  }
}
