import { api } from "./api";
import { ApiResponse, OrderResponseDto, OrderSummaryDto, OrderDetailResponseDto } from "../types";

export const orderService = {
    createFromCart: async (shippingAddress: string, customerPhone: string): Promise<ApiResponse<OrderResponseDto>> => {
        return await api.post("/order", { shippingAddress, customerPhone });
    },

    createDirect: async (productId: number, quantity: number, shippingAddress: string, customerPhone: string): Promise<ApiResponse<OrderResponseDto>> => {
        return await api.post("/order/direct", { productId, quantity, shippingAddress, customerPhone });
    },

    getMyOrders: async (): Promise<ApiResponse<OrderSummaryDto[]>> => {
        return await api.get("/order/my");
    },

    getOrderById: async (id: number): Promise<ApiResponse<OrderDetailResponseDto>> => {
        return await api.get(`/order/${id}`);
    },

    cancelOrder: async (id: number): Promise<ApiResponse<OrderDetailResponseDto>> => {
        return await api.patch(`/order/${id}/cancel`, {});
    },
};