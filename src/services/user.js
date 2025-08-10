import { ref } from 'vue'
import { API_URL } from '../config/api'
import auth from '../stores/auth'

// Singleton user state
const user = ref(null)

export async function fetchUserData() {
  try {
    const headers = {
      'Authorization': `Bearer ${auth.token.value}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
    const response = await fetch(`${API_URL}/me`, { headers })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Failed to fetch user data')
    }
    
    return data.data
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

export function useUser() {
  const refreshUser = async () => {
    try {
      if (auth.token.value) {
        user.value = await fetchUserData()
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }
  
  // Initialize if needed
  if (auth.token.value && !user.value) {
    refreshUser()
  }
  
  return {
    user,
    refreshUser,
    isAdmin: auth.isAdmin,
    isSuperAdmin: auth.isSuperAdmin,
    isMsAdmin: auth.isMsAdmin,
    isStorekeeper: auth.isStorekeeper,
    isCashier: auth.isCashier
  }
}
