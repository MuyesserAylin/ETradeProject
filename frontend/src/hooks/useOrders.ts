import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
    ApiResponse,
    OrderSummaryDto,
    OrderDetailResponseDto,
    CreateOrderRequestDto,
    DirectOrderRequestDto,
    UpdateOrderStatusDto,
} from '@/types'

export const useOrders = () =>
    useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await api.get<ApiResponse<OrderSummaryDto[]>>('/order')
            return res.data.data
        },
    })

export const useOrder = (id: number) =>
    useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const res = await api.get<ApiResponse<OrderDetailResponseDto>>(`/order/${id}`)
            return res.data.data
        },
        enabled: !!id,
    })

export const useCreateOrder = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateOrderRequestDto) => api.post('/order', dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

export const useDirectOrder = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (dto: DirectOrderRequestDto) => api.post('/order/direct', dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.patch(`/order/${id}/cancel`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    })
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateOrderStatusDto }) =>
            api.patch(`/order/${id}/status`, dto),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    })
}

export const useAllOrders = () =>
    useQuery({
        queryKey: ['all-orders'],
        queryFn: async () => {
            const res = await api.get<ApiResponse<OrderSummaryDto[]>>('/order')
            return res.data.data
        },
    })

export const useOrderDetail = (id: number) =>
    useQuery({
        queryKey: ['order-detail', id],
        queryFn: async () => {
            const res = await api.get<ApiResponse<OrderDetailResponseDto>>(`/order/${id}`)
            return res.data.data
        },
        enabled: !!id,
    })