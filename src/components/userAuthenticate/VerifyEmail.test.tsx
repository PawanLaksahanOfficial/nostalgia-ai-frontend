import { StrictMode } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../redux/store";
import { logout, setCredentials } from "../../redux/authSlice";
import { VerifyEmail } from "./VerifyEmail";
import { verifyEmail } from "../../services/userServices";

vi.mock("../../services/userServices", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../services/userServices")>()),
    verifyEmail: vi.fn(),
}));

const renderAt = (url: string) =>
    render(
        <StrictMode>
            <Provider store={store}>
                <MemoryRouter initialEntries={[url]}>
                    <VerifyEmail />
                </MemoryRouter>
            </Provider>
        </StrictMode>
    );

const signIn = (email: string) =>
    store.dispatch(setCredentials({
        token: "test-token",
        user: {
            userId: 1,
            firstName: "Jane",
            lastName: "Doe",
            email,
            avatarUrl: null,
            tier: "free",
            monthlyMemoriesUsed: 0,
            monthlyMemoriesLimit: 3,
            emailVerified: false,
        },
    }));

describe("VerifyEmail", () => {
    afterEach(() => {
        vi.resetAllMocks();
        store.dispatch(logout());
    });

    it("confirms the link once and marks the signed-in account verified", async () => {
        vi.mocked(verifyEmail).mockResolvedValue({});
        signIn("jane@example.com");

        renderAt("/verify-email?token=abc&email=Jane%40example.com");

        expect(await screen.findByText("Email confirmed")).toBeInTheDocument();
        // StrictMode runs effects twice; a single-use link must still be sent only once.
        expect(verifyEmail).toHaveBeenCalledTimes(1);
        expect(verifyEmail).toHaveBeenCalledWith({ email: "Jane@example.com", token: "abc" });
        expect(store.getState().auth.user?.emailVerified).toBe(true);
    });

    it("leaves a different signed-in account untouched", async () => {
        vi.mocked(verifyEmail).mockResolvedValue({});
        signIn("someone.else@example.com");

        renderAt("/verify-email?token=abc&email=jane%40example.com");

        expect(await screen.findByText("Email confirmed")).toBeInTheDocument();
        expect(store.getState().auth.user?.emailVerified).toBe(false);
    });

    it("explains when the link has expired", async () => {
        vi.mocked(verifyEmail).mockRejectedValue(new Error("This verification link is invalid or has expired."));

        renderAt("/verify-email?token=old&email=jane%40example.com");

        expect(await screen.findByText("Link not valid")).toBeInTheDocument();
        expect(screen.getByText(/invalid or has expired/)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Sign in to get a new link" })).toBeInTheDocument();
    });

    it("does not call the server for an incomplete link", () => {
        renderAt("/verify-email?token=abc");

        expect(screen.getByText("Link not valid")).toBeInTheDocument();
        expect(verifyEmail).not.toHaveBeenCalled();
    });
});
