import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse } from '@/types'

interface AuthState {
    user: LoginResponse | null
    token: string | null
    setAuth: (data: LoginResponse) => void
    logout: () => void
    isAdmin: () => boolean
    isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            setAuth: (data) => {
                localStorage.setItem('token', data.token)
                set({ user: data, token: data.token })
            },
            logout: () => {
                localStorage.removeItem('token')
                set({ user: null, token: null })
            },
            isAdmin: () => get().user?.role === 'Admin',
            isLoggedIn: () => get().token !== null,
        }),
        { name: 'etrade-auth' }
    )
)