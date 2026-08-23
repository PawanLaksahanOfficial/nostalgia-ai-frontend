import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Toast {
    id: string;
    type: "success" | "error";
    message: string;
}

export interface ToastState {
    toasts: Toast[];
}

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast(state, action: PayloadAction<{ type: Toast["type"]; message: string }>) {
            state.toasts.push({
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                type: action.payload.type,
                message: action.payload.message,
            });
        },
        removeToast(state, action: PayloadAction<string>) {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
