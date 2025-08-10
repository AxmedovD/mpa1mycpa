import axios from 'axios'
import { API_URL } from '../config/api'

const useAxios = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true
  })

  // Add request interceptor to add auth token if exists
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor to handle common errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        // Handle 403 Forbidden
        if (error.response.status === 403) {
          console.error('Permission denied')
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export { useAxios }
