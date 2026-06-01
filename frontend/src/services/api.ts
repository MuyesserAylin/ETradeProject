const BASE_URL = "https://localhost:7137/api";

const getToken = () => localStorage.getItem("token");

export const api = {
    get: async (url: string) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.json();
    },

    post: async (url: string, body: unknown) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },

    put: async (url: string, body: unknown) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },

    delete: async (url: string) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.json();
    },

    patch: async (url: string, body: unknown) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },
};