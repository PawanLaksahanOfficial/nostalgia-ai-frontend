import { afterEach, describe, it, expect } from "vitest";
import reducer, { logout, setCredentials, setTokens, setUser, updateUser, type AuthState, type UserData } from "./authSlice";

const user: UserData = {
    userId: 1,
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    avatarUrl: null,
    tier: "free",
    monthlyMemoriesUsed: 0,
    monthlyMemoriesLimit: 3,
    emailVerified: true,
};

const signedIn: AuthState = { isAuthenticated: true, token: "t", user: null };

describe("authSlice", () => {
    afterEach(() => localStorage.clear());

    it("keeps both tokens across reloads on sign-in", () => {
        const state = reducer(
            { isAuthenticated: false, token: null, user: null },
            setCredentials({ token: "access", refreshToken: "refresh", user })
        );
        expect(state).toEqual({ isAuthenticated: true, token: "access", user });
        expect(localStorage.getItem("token")).toBe("access");
        expect(localStorage.getItem("refreshToken")).toBe("refresh");
    });

    it("renews tokens without touching the signed-in user", () => {
        const state = reducer({ ...signedIn, user }, setTokens({ token: "new-access", refreshToken: "new-refresh" }));
        expect(state.token).toBe("new-access");
        expect(state.user).toEqual(user);
        expect(localStorage.getItem("token")).toBe("new-access");
        expect(localStorage.getItem("refreshToken")).toBe("new-refresh");
    });

    it("restores the user after a reload without touching the token", () => {
        const state = reducer(signedIn, setUser(user));
        expect(state.user).toEqual(user);
        expect(state.token).toBe("t");
    });

    it("merges partial updates such as a new avatar", () => {
        const state = reducer({ ...signedIn, user }, updateUser({ avatarUrl: "/api/profile/avatar/1/a.jpg" }));
        expect(state.user?.avatarUrl).toBe("/api/profile/avatar/1/a.jpg");
        expect(state.user?.firstName).toBe("Ada");
    });

    it("ignores partial updates when no user is loaded yet", () => {
        const state = reducer(signedIn, updateUser({ firstName: "X" }));
        expect(state.user).toBeNull();
    });

    it("clears everything on logout", () => {
        localStorage.setItem("token", "t");
        localStorage.setItem("refreshToken", "r");
        const state = reducer({ ...signedIn, user }, logout());
        expect(state).toEqual({ isAuthenticated: false, token: null, user: null });
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("refreshToken")).toBeNull();
    });
});
