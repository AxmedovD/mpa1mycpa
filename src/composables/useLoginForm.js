import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../api/auth'
import auth from '../stores/auth'

export function useLoginForm() {
  const router = useRouter()
  
  const username = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)

  const handleLogin = async () => {
    try {
      error.value = ''
      loading.value = true
      
      // Get token and user data from login
      const data = await loginUser(username.value, password.value)
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server')
      }
      
      // Set auth with user data from login response
      const success = await auth.setAuth(data.user, data.token)
      
      if (success) {
        router.push('/')
      } else {
        error.value = 'Failed to authenticate. Please try again.'
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'An error occurred during login'
    } finally {
      loading.value = false
    }
  }

  return {
    username,
    password,
    error,
    loading,
    handleLogin
  }
}