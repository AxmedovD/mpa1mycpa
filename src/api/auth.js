import { API_URL } from '../config/api'

export async function loginUser(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.message || 'Login failed')
    }

    const userType = data.data.user.type
    if (userType !== 'superadmin' && userType !== 'admin' && userType !== 'msadmin') {
      throw new Error('Access denied. Only superadmins, admins and msadmins can login.')
    }

    // Ensure the user object has the required fields
    const userData = {
      ...data.data.user,
      name: data.data.user.name || username, // Fallback to username if name is not provided
      username: data.data.user.username || username,
      type: userType
    }

    return {
      user: userData,
      token: data.data.token
    }
  } catch (error) {
    throw error
  }
}