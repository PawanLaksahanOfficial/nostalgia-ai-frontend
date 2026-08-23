import { apiClient } from "./apiClient";

export const generate = async (text: string, image?: File | null) => {
    try {
        const formData = new FormData();
        formData.append("Text", text);
        if (image) formData.append("Image", image);

        const response = await apiClient.post(
            "/api/memories/generate",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        const apiResponse = response.data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "Generation failed.");
        }
        return apiResponse.data;
    } catch (error) {
        console.error("Error generating nostalgia:", error);
        return null;
    }
};

export const createMemoryVideo = async (title: string, storyText: string, musicMood?: string) => {
    try {
        const response = await apiClient.post(
            "/api/memories/create",
            { title, storyText, musicMood }
        );
        const apiResponse = response.data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "Failed to create memory.");
        }
        return apiResponse.data;
    } catch (error) {
        console.error("Error creating memory video:", error);
        throw error;
    }
};

export const getMemoryStatus = async (jobId: number) => {
    try {
        const response = await apiClient.get(`/api/memories/status/${jobId}`);
        const apiResponse = response.data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "Failed to get memory status.");
        }
        return apiResponse.data;
    } catch (error) {
        console.error("Error getting memory status:", error);
        return null;
    }
};

export const getMyMemories = async () => {
    try {
        const response = await apiClient.get("/api/memories/my");
        const apiResponse = response.data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "Failed to fetch memories.");
        }
        return apiResponse.data;
    } catch (error) {
        console.error("Error fetching memories:", error);
        return [];
    }
};
