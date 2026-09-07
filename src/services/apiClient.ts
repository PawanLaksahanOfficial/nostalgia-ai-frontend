import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


const AUTH_ENDPOINTS = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/user/socialLoginValidate",
];

const isAuthEndpoint = (url?: string) =>
    !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url as string | undefined;

        if (status === 401 && !isAuthEndpoint(requestUrl)) {
            const wasAuthenticated = store.getState().auth.isAuthenticated;
            store.dispatch(logout());

            if (wasAuthenticated && window.location.pathname !== "/signIn") {
                window.location.assign("/signIn?expired=1");
            }
        }
        return Promise.reject(error);
    }
);

export const extractApiMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string; errors?: string[] }
            | undefined;

        if (data?.errors?.length) {
            return data.errors[0];
        }
        if (data?.message) {
            return data.message;
        }
        if (!error.response) {
            return "Could not reach the server. Check your connection and try again.";
        }
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
};
