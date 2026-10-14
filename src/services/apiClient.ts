import axios, { type InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { logout, setTokens } from "../redux/authSlice";
import { getAccessToken, getRefreshToken } from "./tokenStorage";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const publicApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const AUTH_ENDPOINTS = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/refresh",
    "/api/auth/logout",
    "/api/user/socialLoginValidate",
];

const isAuthEndpoint = (url?: string) =>
    !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

// The server refused the refresh token: the session is over and the user has to sign in again.
class SessionExpiredError extends Error {}

const REFRESH_LOCK = "nostalgia-auth-refresh";
let refreshInFlight: Promise<string> | null = null;

// Tabs share localStorage, so a lock stops two tabs spending the same refresh token at once:
// the server treats a second use as theft and ends the session.
const withRefreshLock = async (task: () => Promise<string>): Promise<string> => {
    if (!navigator.locks) {
        return task();
    }
    return navigator.locks.request(REFRESH_LOCK, task);
};

const rotateTokens = async (failedAccessToken: string | null): Promise<string> => {
    // An earlier refresh, in this tab or another, already replaced the token that failed.
    const accessToken = getAccessToken();
    if (accessToken && accessToken !== failedAccessToken) {
        return accessToken;
    }
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new SessionExpiredError();
    }

    let data: { token: string; refreshToken: string };
    try {
        const response = await publicApiClient.post("/api/auth/refresh", { refreshToken });
        data = response.data.data;
    } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        if (status === 400 || status === 401) {
            throw new SessionExpiredError();
        }
        throw error;
    }
    store.dispatch(setTokens({ token: data.token, refreshToken: data.refreshToken }));
    return data.token;
};

// Several requests fail together when the access token expires; they all wait for one refresh.
const refreshAccessToken = (failedAccessToken: string | null): Promise<string> => {
    if (!refreshInFlight) {
        refreshInFlight = withRefreshLock(() => rotateTokens(failedAccessToken)).finally(() => {
            refreshInFlight = null;
        });
    }
    return refreshInFlight;
};

const sentAccessToken = (request: RetriableRequest): string | null =>
    String(request.headers.Authorization ?? "").replace(/^Bearer /, "") || null;

const endSession = () => {
    const wasAuthenticated = store.getState().auth.isAuthenticated;
    store.dispatch(logout());

    if (wasAuthenticated && window.location.pathname !== "/signIn") {
        window.location.assign("/signIn?expired=1");
    }
};

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const request = error.config as RetriableRequest | undefined;

        if (status !== 401 || !request || isAuthEndpoint(request.url)) {
            return Promise.reject(error);
        }

        if (!request._retry && getRefreshToken()) {
            request._retry = true;
            try {
                const token = await refreshAccessToken(sentAccessToken(request));
                request.headers.Authorization = `Bearer ${token}`;
                return apiClient(request);
            } catch (refreshError) {
                if (!(refreshError instanceof SessionExpiredError)) {
                    // Offline or the server is down: keep the session so a later request can retry.
                    return Promise.reject(error);
                }
            }
        }

        endSession();
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
