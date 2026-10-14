import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearTokens, getAccessToken, saveTokens } from "../services/tokenStorage";

export interface UserData {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    tier: 'free' | 'premium';
    monthlyMemoriesUsed: number;
    monthlyMemoriesLimit: number;
    emailVerified: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: UserData | null;
}

const initialState: AuthState = {
    isAuthenticated: !!getAccessToken(),
    token: getAccessToken(),
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{
            token: string;
            refreshToken: string;
            user: UserData;
        }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            saveTokens(action.payload.token, action.payload.refreshToken);
        },
        // A renewed session (refresh or password change) keeps the signed-in user as is.
        setTokens(state, action: PayloadAction<{ token: string; refreshToken: string }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            saveTokens(action.payload.token, action.payload.refreshToken);
        },
        setUser(state, action: PayloadAction<UserData>) {
            state.user = action.payload;
        },
        updateUser(state, action: PayloadAction<Partial<UserData>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            clearTokens();
        },
    },
});

export const { setCredentials, setTokens, setUser, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
