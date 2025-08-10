import { ref, computed } from 'vue'
import { fetchUserData } from '../api/user'

// State
const user = ref(null)
const token = ref(null)
const lastActivity = ref(null)
const SESSION_TIMEOUT = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

// Helper functions
const updateLastActivity = () => {
  lastActivity.value = Date.now()
  localStorage.setItem('lastActivity', lastActivity.value.toString())
}

const clearAuth = () => {
  user.value = null
  token.value = null
  lastActivity.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('lastActivity')
}

// Initialize from localStorage
const initializeAuth = async () => {
  const storedToken = localStorage.getItem('token')
  const storedLastActivity = localStorage.getItem('lastActivity')
  
  if (!storedToken || !storedLastActivity) {
    clearAuth()
    return false
  }

  const lastActivityTime = parseInt(storedLastActivity)
  const now = Date.now()
  
  // Check if session has expired
  if (now - lastActivityTime > SESSION_TIMEOUT) {
    clearAuth()
    return false
  }
  
  token.value = storedToken
  lastActivity.value = lastActivityTime
  return true
}

// Watch for changes and update localStorage
const updateToken = (newToken) => {
  if (newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    updateLastActivity()
  } else {
    clearAuth()
  }
}

// Create store
export function useAuth() {
  // Computed properties for user roles
  const isAdmin = computed(() => user.value?.type === 'admin')
  const isSuperAdmin = computed(() => user.value?.type === 'superadmin')
  const isMsAdmin = computed(() => user.value?.type === 'msadmin')
  const isStorekeeper = computed(() => user.value?.type === 'storekeeper')
  const isCashier = computed(() => user.value?.is_cashier === true)

  const setAuth = async (userData, newToken) => {
    try {
      if (!userData || !newToken) {
        throw new Error('Invalid auth data')
      }
      
      // Update token first
      updateToken(newToken)
      
      // Set user data
      user.value = userData
      
      return true
    } catch (error) {
      console.error('Auth error:', error)
      clearAuth()
      return false
    }
  }

  const refreshUser = async () => {
    try {
      if (!token.value) {
        throw new Error('No token available')
      }
      const userData = await fetchUserData()
      user.value = userData
      return true
    } catch (error) {
      console.error('Failed to refresh user:', error)
      return false
    }
  }

  const logout = () => {
    clearAuth()
  }

  const checkAuth = async () => {
    const hasValidToken = await initializeAuth()
    if (hasValidToken && !user.value) {
      await refreshUser()
    }
    return !!token.value
  }

  return {
    user,
    token,
    isAdmin,
    isSuperAdmin,
    isMsAdmin,
    isStorekeeper,
    isCashier,
    setAuth,
    refreshUser,
    logout,
    checkAuth
  }
}

// Create a single instance
const auth = useAuth()
export default auth