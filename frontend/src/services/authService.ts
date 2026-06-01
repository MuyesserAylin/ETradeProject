import { api } from "./api";
import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest } from "../types";

export const authService = {
    login: async (request: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return await api.post("/auth/login", request);
    },

    register: async (request: RegisterRequest): Promise<ApiResponse<string>> => {
        return await api.post("/auth/register", request);
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("fullName");
    },

    isLoggedIn: () => {
        return !!localStorage.getItem("token");
    },

    getRole: () => {
        return localStorage.getItem("role");
    },

    getFullName: () => {
        return localStorage.getItem("fullName");
    }
};
