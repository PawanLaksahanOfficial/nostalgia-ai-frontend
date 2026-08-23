import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface styleState {
    isMobile: boolean,
    theme: "light" | "dark"
}

const getInitialTheme = (): "light" | "dark" => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialState: styleState =  {
    isMobile: false,
    theme: getInitialTheme(),
}

const styleSlice = createSlice({
    name: "style",
    initialState,
    reducers: {
        //set isMobile
        setMobile(state, action: PayloadAction<boolean>) {
            state.isMobile = action.payload;
        },
        //set theme
        setTheme(state, action: PayloadAction<"light" | "dark">) {
            state.theme = action.payload;
        },
    },
});

export const { setMobile, setTheme } = styleSlice.actions;
export default styleSlice.reducer;