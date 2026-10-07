import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{
            token: string;
            user: UserData;
        }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem('token', action.payload.token);
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
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, setUser, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;