import { configureStore } from "@reduxjs/toolkit";
import styleReducer from "./styleSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        style: styleReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
