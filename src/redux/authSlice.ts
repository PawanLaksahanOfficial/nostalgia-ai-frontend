import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userId: number | null;
    email: string | null;
    userName: string | null;
    tier: "free" | "premium";
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    userId: null,
    email: null,
    userName: null,
    tier: "free",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{
            token: string;
            userId?: number;
            email?: string;
            userName?: string;
            tier?: "free" | "premium";
        }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.userId = action.payload.userId ?? null;
            state.email = action.payload.email ?? null;
            state.userName = action.payload.userName ?? null;
            state.tier = action.payload.tier ?? "free";
            localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.userId = null;
            state.email = null;
            state.userName = null;
            state.tier = "free";
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;