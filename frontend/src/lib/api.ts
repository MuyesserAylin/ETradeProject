import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7137/api',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
                localStorage.removeItem('etrade-auth')
                window.location.href = '/auth/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api