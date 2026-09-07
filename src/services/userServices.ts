import type { AxiosResponse } from "axios";
import { apiClient, extractApiMessage } from "./apiClient";
import type { VideoStatus } from "./videoServices";

export interface UserSummary {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    tier: 'free' | 'premium';
    monthlyMemoriesUsed: number;
    monthlyMemoriesLimit: number;
}

export interface AuthResult {
    token: string;
    user: UserSummary;
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
    status: VideoStatus;
    createdAt: string;
    completedAt: string | null;
    hasVideo: boolean;
}

export interface PlanOption {
    tier: 'free' | 'premium';
    name: string;
    priceId: string | null;
    amountMinorUnits: number | null;
    currency: string | null;
    interval: string | null;
    monthlyMemories: number;
    maxVideoDurationSeconds: number;
    quality: string;
    hasWatermark: boolean;
}

export interface SubscriptionStatus {
    tier: 'free' | 'premium';
    hasActiveSubscription: boolean;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
}

const unwrap = async <T>(call: Promise<AxiosResponse>, fallback: string): Promise<T> => {
    try {
        const apiResponse = (await call).data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || fallback);
        }
        return apiResponse.data as T;
    } catch (error) {
        throw new Error(extractApiMessage(error, fallback));
    }
};

export const postSocialToken = (token: string, provider: 'google' | 'meta'): Promise<AuthResult> =>
    unwrap<AuthResult>(
        apiClient.post("/api/user/socialLoginValidate", { tokenId: token, provider }),
        "Social authentication failed."
    );

export const register = (
    data: { firstName: string; lastName: string; email: string; password: string }
): Promise<AuthResult> =>
    unwrap<AuthResult>(apiClient.post("/api/auth/register", data), "Registration failed.");

export const login = (data: { email: string; password: string }): Promise<AuthResult> =>
    unwrap<AuthResult>(apiClient.post("/api/auth/login", data), "Login failed.");

export const forgotPassword = (email: string): Promise<unknown> =>
    unwrap(apiClient.post("/api/auth/forgot-password", { email }), "Could not send the reset email.");

export const resetPassword = (
    data: { email: string; token: string; newPassword: string }
): Promise<unknown> =>
    unwrap(apiClient.post("/api/auth/reset-password", data), "Could not reset your password.");

export const getProfile = (): Promise<ProfileData> =>
    unwrap<ProfileData>(apiClient.get("/api/profile/myProfile"), "Failed to load profile.");

export const updateProfile = (
    data: { firstName?: string; lastName?: string; avatarUrl?: string }
): Promise<unknown> =>
    unwrap(apiClient.put("/api/profile/myProfile", data), "Failed to update profile.");

export const changePassword = (
    data: { currentPassword: string; newPassword: string }
): Promise<unknown> =>
    unwrap(apiClient.put("/api/profile/change-password", data), "Failed to change password.");

export const getMyMemories = (): Promise<MemoryItem[]> =>
    unwrap<MemoryItem[]>(apiClient.get("/api/profile/memories"), "Failed to load memories.");

export const getPlans = (): Promise<PlanOption[]> =>
    unwrap<PlanOption[]>(apiClient.get("/api/subscription/plans"), "Failed to load plans.");

export const getSubscriptionStatus = (): Promise<SubscriptionStatus> =>
    unwrap<SubscriptionStatus>(apiClient.get("/api/subscription/status"), "Failed to load subscription status.");

export const createCheckoutSession = (
    priceId: string,
    successUrl: string,
    cancelUrl: string
): Promise<{ sessionId: string; sessionUrl: string }> =>
    unwrap(
        apiClient.post("/api/subscription/checkout", { priceId, successUrl, cancelUrl }),
        "Failed to start checkout."
    );

export const createPortalSession = (returnUrl: string): Promise<{ portalUrl: string }> =>
    unwrap(apiClient.post("/api/subscription/portal", { returnUrl }), "Failed to open the billing portal.");

export const cancelSubscription = (): Promise<unknown> =>
    unwrap(apiClient.post("/api/subscription/cancel"), "Failed to cancel the subscription.");

export const resumeSubscription = (): Promise<unknown> =>
    unwrap(apiClient.post("/api/subscription/resume"), "Failed to resume the subscription.");
