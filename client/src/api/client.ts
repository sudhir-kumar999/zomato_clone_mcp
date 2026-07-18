import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const isAuthRoute = (url?: string) =>
  url?.startsWith('/auth/login') || url?.startsWith('/auth/register')

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthRoute(error.config?.url)) {
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default api
