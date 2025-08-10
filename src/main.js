import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import auth from './stores/auth'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import axios from 'axios'
import { API_URL } from './config/api'

// Set axios base URL
axios.defaults.baseURL = API_URL

// Toast options
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
}

// Initialize the app
const app = createApp(App)

// Use plugins
app.use(Toast, toastOptions)

// Wait for auth check before mounting
auth.checkAuth().then(() => {
  app.use(router)
  app.mount('#app')
})