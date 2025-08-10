const API_URL = 'https://api.mgoods.uz/api'

export async function fetchUserData(providedToken = null) {
  try {
    const token = providedToken || localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    return userData // The API already returns the user object directly
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}
