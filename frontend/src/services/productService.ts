import { api } from "./api";
import { ApiResponse, ProductDetailResponseDto, ProductResponseDto } from "../types";

export const productService = {
    getAll: async (categoryId?: number): Promise<ApiResponse<ProductResponseDto[]>> => {
        const url = categoryId ? `/product?categoryId=${categoryId}` : "/product";
        return await api.get(url);
    },

    getById: async (id: number): Promise<ApiResponse<ProductDetailResponseDto>> => {
        return await api.get(`/product/${id}`);
    },
};