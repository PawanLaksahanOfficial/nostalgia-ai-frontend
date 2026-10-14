import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { apiClient, publicApiClient } from "./apiClient";
import { getAccessToken, getRefreshToken, saveTokens } from "./tokenStorage";
import { store } from "../redux/store";
import { logout, setCredentials, type UserData } from "../redux/authSlice";

const user: UserData = {
    userId: 5,
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    avatarUrl: null,
    tier: "free",
    monthlyMemoriesUsed: 0,
    monthlyMemoriesLimit: 3,
    emailVerified: true,
};

const reply = (config: InternalAxiosRequestConfig, status: number, data: unknown = {}): Promise<AxiosResponse> => {
    const response: AxiosResponse = { data, status, statusText: "", headers: {}, config };
    return status < 400
        ? Promise.resolve(response)
        : Promise.reject(new AxiosError(`Request failed with status code ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, response));
};

// A protected endpoint that only accepts one access token.
const acceptOnly = (token: string): AxiosAdapter => (config) =>
    config.headers.Authorization === `Bearer ${token}`
        ? reply(config, 200, { success: true, data: "ok" })
        : reply(config, 401, { success: false, message: "Invalid or missing authentication token." });

const refreshTo = (token: string, refreshToken: string) =>
    vi.fn<AxiosAdapter>((config) => reply(config, 200, { success: true, data: { token, refreshToken, user } }));

const originalAdapter = apiClient.defaults.adapter;
const originalPublicAdapter = publicApiClient.defaults.adapter;

describe("apiClient session refresh", () => {
    beforeEach(() => {
        // Signing out only navigates away from other pages, and jsdom can't navigate.
        window.history.replaceState({}, "", "/signIn");
        store.dispatch(setCredentials({ token: "expired-token", refreshToken: "refresh-1", user }));
    });

    afterEach(() => {
        store.dispatch(logout());
        apiClient.defaults.adapter = originalAdapter;
        publicApiClient.defaults.adapter = originalPublicAdapter;
    });

    it("renews an expired access token and retries the request", async () => {
        apiClient.defaults.adapter = acceptOnly("fresh-token");
        const refresh = refreshTo("fresh-token", "refresh-2");
        publicApiClient.defaults.adapter = refresh;

        const response = await apiClient.get("/api/profile/myProfile");

        expect(response.data.data).toBe("ok");
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(JSON.parse(refresh.mock.calls[0][0].data)).toEqual({ refreshToken: "refresh-1" });
        expect(getAccessToken()).toBe("fresh-token");
        expect(getRefreshToken()).toBe("refresh-2");
        expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    it("makes a single refresh call when several requests fail together", async () => {
        apiClient.defaults.adapter = acceptOnly("fresh-token");
        const refresh = refreshTo("fresh-token", "refresh-2");
        publicApiClient.defaults.adapter = refresh;

        const responses = await Promise.all([
            apiClient.get("/api/videos"),
            apiClient.get("/api/profile/myProfile"),
            apiClient.get("/api/subscription/status"),
        ]);

        expect(responses.map((r) => r.data.data)).toEqual(["ok", "ok", "ok"]);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("uses tokens another tab already renewed instead of refreshing again", async () => {
        apiClient.defaults.adapter = (config) => {
            if (config.headers.Authorization === "Bearer expired-token") {
                // Another tab rotates the session while this request is on its way.
                saveTokens("fresh-token", "refresh-2");
            }
            return acceptOnly("fresh-token")(config);
        };
        const refresh = refreshTo("unexpected", "unexpected");
        publicApiClient.defaults.adapter = refresh;

        const response = await apiClient.get("/api/videos");

        expect(response.data.data).toBe("ok");
        expect(refresh).not.toHaveBeenCalled();
    });

    it("signs out when the server rejects the refresh token", async () => {
        apiClient.defaults.adapter = acceptOnly("fresh-token");
        publicApiClient.defaults.adapter = (config) => reply(config, 401, { success: false });

        await expect(apiClient.get("/api/videos")).rejects.toMatchObject({ response: { status: 401 } });

        expect(store.getState().auth.isAuthenticated).toBe(false);
        expect(getAccessToken()).toBeNull();
        expect(getRefreshToken()).toBeNull();
    });

    it("keeps the session when the refresh can't reach the server", async () => {
        apiClient.defaults.adapter = acceptOnly("fresh-token");
        publicApiClient.defaults.adapter = (config) =>
            Promise.reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config));

        await expect(apiClient.get("/api/videos")).rejects.toMatchObject({ response: { status: 401 } });

        expect(store.getState().auth.isAuthenticated).toBe(true);
        expect(getRefreshToken()).toBe("refresh-1");
    });

    it("signs out straight away when there is no refresh token", async () => {
        store.dispatch(setCredentials({ token: "expired-token", refreshToken: "", user }));
        apiClient.defaults.adapter = acceptOnly("fresh-token");
        const refresh = refreshTo("fresh-token", "refresh-2");
        publicApiClient.defaults.adapter = refresh;

        await expect(apiClient.get("/api/videos")).rejects.toMatchObject({ response: { status: 401 } });

        expect(refresh).not.toHaveBeenCalled();
        expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    it("never refreshes for a failed sign-in", async () => {
        apiClient.defaults.adapter = (config) => reply(config, 401, { success: false, message: "Invalid email or password." });
        const refresh = refreshTo("fresh-token", "refresh-2");
        publicApiClient.defaults.adapter = refresh;

        await expect(apiClient.post("/api/auth/login", {})).rejects.toMatchObject({ response: { status: 401 } });

        expect(refresh).not.toHaveBeenCalled();
        expect(store.getState().auth.isAuthenticated).toBe(true);
    });
});
