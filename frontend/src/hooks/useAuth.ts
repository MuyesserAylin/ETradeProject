import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { LoginRequest, RegisterRequest, LoginResponse, ApiResponse } from '@/types'

export const useLogin = () => {
    const { setAuth } = useAuthStore()
    const router = useRouter()

    return useMutation({
        mutationFn: async (req: LoginRequest) => {
            const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', req)
            return res.data.data
        },
        onSuccess: (data) => {
            setAuth(data)
            if (data.role === 'Admin') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        },
    })
}

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: async (req: RegisterRequest) => {
            const res = await api.post('/auth/register', req)
            return res.data
        },
        onSuccess: () => {
            router.push('/auth/login')
        },
    })
}