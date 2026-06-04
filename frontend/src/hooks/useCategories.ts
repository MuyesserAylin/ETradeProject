import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ApiResponse, CategoryResponseDto, CategoryCreateDto } from '@/types'

export const useCategories = () =>
    useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get<ApiResponse<CategoryResponseDto[]>>('/category')
            return res.data.data
        },
    })

export const useAddCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: CategoryCreateDto) => api.post('/category', dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    })
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: CategoryCreateDto }) =>
            api.put(`/category/${id}`, dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.delete(`/category/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    })
}