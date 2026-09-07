import type { AxiosResponse } from "axios";
import { apiClient, extractApiMessage } from "./apiClient";

export interface MemoryStatus {
    id: number;
    title: string;
    status: string;
    generatedNarrative: string | null;
    videoUrl: string | null;
    createdAt: string;
    completedAt: string | null;
}

const unwrap = async <T>(call: Promise<AxiosResponse>, fallback: string): Promise<T> => {
    try {
        const apiResponse = (await call).data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || fallback);
        }
        return apiResponse.data as T;
    } catch (error) {
        throw new Error(extractApiMessage(error, fallback));
    }
};

export const generate = (text: string): Promise<string> =>
    unwrap<string>(
        apiClient.post("/api/memories/generate", { text }),
        "Could not generate your memory."
    );

export const createMemoryVideo = (
    title: string,
    storyText: string,
    musicMood?: string
): Promise<{ jobId: number; status: string }> =>
    unwrap(
        apiClient.post("/api/memories/create", { title, storyText, musicMood }),
        "Failed to queue your memory."
    );

export const getMemoryStatus = (jobId: number): Promise<MemoryStatus> =>
    unwrap<MemoryStatus>(
        apiClient.get(`/api/memories/status/${jobId}`),
        "Failed to get memory status."
    );

export const getMyMemories = (): Promise<unknown[]> =>
    unwrap<unknown[]>(apiClient.get("/api/memories/my"), "Failed to fetch memories.");
