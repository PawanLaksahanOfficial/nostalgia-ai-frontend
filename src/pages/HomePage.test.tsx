import { StrictMode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../redux/store";
import { setCredentials } from "../redux/authSlice";
import { HomePage } from "./HomePage";
import { createVideo, fetchVideoObjectUrl, getVideoStatus } from "../services/videoServices";
import type { VideoStatus, VideoStatusResponse } from "../services/videoServices";

vi.mock("../services/videoServices", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../services/videoServices")>()),
    createVideo: vi.fn(),
    getVideoStatus: vi.fn(),
    fetchVideoObjectUrl: vi.fn(),
}));

// jsdom has no object-URL support; the page revokes its preview URL on unmount.
URL.revokeObjectURL = vi.fn();

const STORY = "We spent every summer at my grandmother's house by the lake.";

const statusResponse = (status: VideoStatus): VideoStatusResponse => ({
    id: 1,
    status,
    processingStep: status === "Processing" ? "Composing your video…" : null,
    failureReason: null,
    hasVideo: status === "Completed",
    durationSeconds: status === "Completed" ? 20 : null,
    completedAt: status === "Completed" ? "2026-10-08T00:00:00Z" : null,
    narrationSource: status === "Completed" ? "Ai" : null,
    stockPhotoCredit: null,
});

// StrictMode runs mount effects twice, as the real app does in development.
const renderHomePage = () =>
    render(
        <StrictMode>
            <Provider store={store}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </Provider>
        </StrictMode>
    );

// The labels are not tied to their inputs, so the fields are found by order: title, then story.
const fillForm = (story: string) => {
    const [titleInput, storyInput] = screen.getAllByRole("textbox");
    fireEvent.change(titleInput, { target: { value: "Summers at the lake" } });
    fireEvent.change(storyInput, { target: { value: story } });
};

const generate = async () => {
    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Generate Video" }));
    });
};

const advance = async (ms: number) => {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(ms);
    });
};

const testUser = {
    userId: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    avatarUrl: null,
    tier: "free" as const,
    monthlyMemoriesUsed: 0,
    monthlyMemoriesLimit: 3,
    emailVerified: true,
};

describe("HomePage video generation", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        store.dispatch(setCredentials({ token: "test-token", user: testUser }));
        vi.mocked(createVideo).mockResolvedValue({ id: 1, status: "Pending" });
        vi.mocked(fetchVideoObjectUrl).mockResolvedValue("blob:video");
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.resetAllMocks();
    });

    it("keeps polling while the status is unchanged, then shows the finished video", async () => {
        vi.mocked(getVideoStatus)
            .mockResolvedValueOnce(statusResponse("Pending"))
            .mockResolvedValueOnce(statusResponse("Processing"))
            .mockResolvedValueOnce(statusResponse("Processing"))
            .mockResolvedValueOnce(statusResponse("Processing"))
            .mockResolvedValueOnce(statusResponse("Completed"));

        renderHomePage();
        fillForm(STORY);
        await generate();
        for (let poll = 0; poll < 5; poll++) {
            await advance(2000);
        }
        await advance(0);

        expect(getVideoStatus).toHaveBeenCalledTimes(5);
        expect(fetchVideoObjectUrl).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Generated Video")).toBeInTheDocument();
    });

    it("keeps polling after a status request fails", async () => {
        vi.mocked(getVideoStatus)
            .mockRejectedValueOnce(new Error("Network Error"))
            .mockResolvedValueOnce(statusResponse("Completed"));

        renderHomePage();
        fillForm(STORY);
        await generate();
        await advance(2000);
        await advance(2000);
        await advance(0);

        expect(getVideoStatus).toHaveBeenCalledTimes(2);
        expect(screen.getByText("Generated Video")).toBeInTheDocument();
    });

    it("stops polling once the video is finished", async () => {
        vi.mocked(getVideoStatus).mockResolvedValue(statusResponse("Completed"));

        renderHomePage();
        fillForm(STORY);
        await generate();
        await advance(2000);
        await advance(30_000);

        expect(getVideoStatus).toHaveBeenCalledTimes(1);
    });

    it("asks users to confirm their email before they can generate", () => {
        store.dispatch(setCredentials({ token: "test-token", user: { ...testUser, emailVerified: false } }));

        renderHomePage();
        fillForm(STORY);

        expect(screen.getByText(/confirm your email to start creating videos/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Resend email" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Generate Video" })).toBeDisabled();
    });

    it("keeps Generate disabled until the story is long enough for the server", () => {
        renderHomePage();
        fillForm("Too short");

        expect(screen.getByRole("button", { name: "Generate Video" })).toBeDisabled();
        expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
    });
});
