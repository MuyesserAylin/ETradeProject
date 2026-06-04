import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, ProductResponseDto, ProductDetailResponseDto, ProductCreateDto, ProductUpdateDto } from '@/types'

export const useProducts = (categoryId?: number) =>
    useQuery({
        queryKey: ['products', categoryId],
        queryFn: async () => {
            const res = await api.get<ApiResponse<ProductResponseDto[]>>('/product', {
                params: categoryId ? { categoryId } : {},
            })
            return res.data.data
        },
    })

export const useProduct = (id: number) =>
    useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get<ApiResponse<ProductDetailResponseDto>>(`/product/${id}`)
            return res.data.data
        },
        enabled: !!id,
    })

export const useAddProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: ProductCreateDto) => api.post('/product', dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: ProductUpdateDto }) =>
            api.put(`/product/${id}`, dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.delete(`/product/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    })
}