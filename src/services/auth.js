import { useAuth } from '../stores/auth'

export class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function getAuthHeaders() {
  const auth = useAuth()
  const token = auth.token.value
  
  if (!token) {
    throw new AuthError('No authentication token available')
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
}

export async function handleApiResponse(response) {
  if (!response.ok) {
    const data = await response.json()
    
    // Handle authentication errors
    if (response.status === 401) {
      const auth = useAuth()
      auth.clearAuth() // Clear invalid token
      throw new AuthError('Authentication failed')
    }
    
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}