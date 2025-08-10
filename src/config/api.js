const isDevelopment = import.meta.env.DEV

export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8000/api/admin'
  : 'https://api.mgoods.uz/api/admin'

export default {
  API_URL
}
