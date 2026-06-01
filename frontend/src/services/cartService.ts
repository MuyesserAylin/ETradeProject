import { api } from "./api";
import { ApiResponse, CartItemResponseDto, CartResponseDto } from "../types";

export const cartService = {
    getCart: async (): Promise<ApiResponse<CartResponseDto>> => {
        return await api.get("/cart");
    },

    addToCart: async (productId: number, quantity: number): Promise<ApiResponse<CartItemResponseDto>> => {
        return await api.post("/cart", { productId, quantity });
    },

    updateQuantity: async (productId: number, quantity: number): Promise<ApiResponse<CartItemResponseDto>> => {
        return await api.patch(`/cart/${productId}`, { quantity });
    },

    removeFromCart: async (id: number): Promise<ApiResponse<object>> => {
        return await api.delete(`/cart/${id}`);
    },

    clearCart: async (): Promise<ApiResponse<object>> => {
        return await api.delete("/cart");
    },
};