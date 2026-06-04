import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { ApiResponse, CartResponseDto, AddToCartDto, UpdateCartItemDto } from '@/types'

export const useCart = () => {
    const { isLoggedIn, isAdmin } = useAuthStore()
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await api.get<ApiResponse<CartResponseDto>>('/cart')
            return res.data.data
        },
        enabled: isLoggedIn() && !isAdmin(),
    })
}
export const useAddToCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: AddToCartDto) => api.post('/cart', dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    })
}

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateCartItemDto }) =>
            api.patch(`/cart/${id}`, dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    })
}

export const useDeleteCartItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.delete(`/cart/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => api.delete('/cart'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    })
}