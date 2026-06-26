import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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

export const postSocialToken = async (token: string, provider: 'google' | 'meta'): Promise<AuthResult> => {
    const endpoint = "/api/user/socialLoginValidate";
    const response = await axios.post(baseUrl + endpoint, {
        tokenId: token,
        provider: provider
    });
    return response.data;
};

export const register = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<AuthResult> => {
    const response = await axios.post(baseUrl + "/api/auth/register", data);
    return response.data;
};

export const login = async (data: { email: string; password: string }): Promise<AuthResult> => {
    const response = await axios.post(baseUrl + "/api/auth/login", data);
    return response.data;
};

export const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(baseUrl + "/api/profile/me", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const updateProfile = async (data: { firstName?: string; lastName?: string; avatarUrl?: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(baseUrl + "/api/profile/me", data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(baseUrl + "/api/profile/change-password", data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const getMyMemories = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(baseUrl + "/api/profile/memories", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const getUsageQuota = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(baseUrl + "/api/profile/quota", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};

export const createCheckoutSession = async (priceId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(baseUrl + "/api/subscription/checkout", { priceId }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
};