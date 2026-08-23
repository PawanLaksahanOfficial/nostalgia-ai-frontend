import { apiClient } from "./apiClient";

export interface AuthResult {
    token: string;
    user: {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string | null;
        tier: 'free' | 'premium';
        monthlyMemoriesUsed: number;
        monthlyMemoriesLimit: number;
    };
}

export interface ProfileData {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    tier: 'free' | 'premium';
    quota: {
        monthlyMemoriesUsed: number;
        monthlyMemoriesLimit: number;
        maxVideoDurationSeconds: number;
        quality: string;
        hasWatermark: boolean;
    };
}

export interface MemoryItem {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    completedAt: string | null;
    hasVideo: boolean;
}

export const postSocialToken = async (token: string, provider: 'google' | 'meta'): Promise<AuthResult> => {
    const response = await apiClient.post("/api/user/socialLoginValidate", {
        tokenId: token,
        provider: provider
    });
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Social authentication failed.");
    }
    return { token: apiResponse.data, user: null as any };
};

export const register = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<AuthResult> => {
    const response = await apiClient.post("/api/auth/register", data);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Registration failed.");
    }
    return apiResponse.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResult> => {
    const response = await apiClient.post("/api/auth/login", data);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Login failed.");
    }
    return apiResponse.data;
};

export const getProfile = async (): Promise<ProfileData> => {
    const response = await apiClient.get("/api/profile/myProfile");
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load profile.");
    }
    return apiResponse.data;
};

export const updateProfile = async (data: { firstName?: string; lastName?: string; avatarUrl?: string }): Promise<void> => {
    const response = await apiClient.put("/api/profile/myProfile", data);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to update profile.");
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    const response = await apiClient.put("/api/profile/change-password", data);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to change password.");
    }
};

export const getMyMemories = async (): Promise<MemoryItem[]> => {
    const response = await apiClient.get("/api/profile/memories");
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load memories.");
    }
    return apiResponse.data;
};

export const createCheckoutSession = async (priceId: string, successUrl: string, cancelUrl: string): Promise<{ sessionId: string; sessionUrl: string }> => {
    const response = await apiClient.post("/api/subscription/checkout", { priceId, successUrl, cancelUrl });
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to create checkout session.");
    }
    return apiResponse.data;
};
