import { apiClient, extractApiMessage, publicApiClient } from "./apiClient";

export type VideoStatus = "Pending" | "Processing" | "Completed" | "Failed";

// "Original" means the AI was unavailable and the user's own text was narrated as written.
export type NarrationSource = "Ai" | "Original";

export interface VideoListItem {
    id: number;
    title: string;
    status: VideoStatus;
    quality: string;
    musicMood: string | null;
    durationSeconds: number | null;
    fileSizeBytes: number | null;
    isPublic: boolean;
    viewCount: number;
    processingStep: string | null;
    failureReason: string | null;
    hasVideo: boolean;
    hasThumbnail: boolean;
    narrationSource: NarrationSource | null;
    stockPhotoCredit: string | null;
    createdAt: string;
    completedAt: string | null;
}

export interface VideoDetail extends VideoListItem {
    storyText: string;
    narrative: string | null;
}

export interface VideoStatusResponse {
    id: number;
    status: VideoStatus;
    processingStep: string | null;
    failureReason: string | null;
    hasVideo: boolean;
    durationSeconds: number | null;
    completedAt: string | null;
    narrationSource: NarrationSource | null;
    stockPhotoCredit: string | null;
}

export interface ShareLinkItem {
    id: number;
    token: string;
    shareUrl: string;
    label: string | null;
    expiresAt: string | null;
    isRevoked: boolean;
    isExpired: boolean;
    viewCount: number;
    createdAt: string;
}

export interface PublicVideo {
    token: string;
    title: string;
    narrative: string | null;
    durationSeconds: number | null;
    ownerFirstName: string;
    createdAt: string;
    viewCount: number;
    stockPhotoCredit: string | null;
}

export const createVideo = async (
    title: string,
    storyText: string,
    musicMood: string | null,
    image: File | null
): Promise<{ id: number; status: VideoStatus }> => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("StoryText", storyText);
    if (musicMood) formData.append("MusicMood", musicMood);
    if (image) formData.append("image", image);

    try {
        const response = await apiClient.post("/api/videos", formData);
        const apiResponse = response.data;
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "Failed to create video.");
        }
        return apiResponse.data;
    } catch (error) {
        throw new Error(extractApiMessage(error, "Failed to create video."));
    }
};

export const getMyVideos = async (): Promise<VideoListItem[]> => {
    const response = await apiClient.get("/api/videos");
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load videos.");
    }
    return apiResponse.data;
};

export const getVideo = async (id: number): Promise<VideoDetail> => {
    const response = await apiClient.get(`/api/videos/${id}`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load video.");
    }
    return apiResponse.data;
};

export const getVideoStatus = async (id: number): Promise<VideoStatusResponse> => {
    const response = await apiClient.get(`/api/videos/${id}/status`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load video status.");
    }
    return apiResponse.data;
};

export const renameVideo = async (id: number, title: string): Promise<void> => {
    const response = await apiClient.put(`/api/videos/${id}`, { title });
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to rename video.");
    }
};

export const deleteVideo = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/api/videos/${id}`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to delete video.");
    }
};

export const createShareLink = async (
    id: number,
    expiresInDays: number | null,
    label: string | null
): Promise<ShareLinkItem> => {
    const response = await apiClient.post(`/api/videos/${id}/share`, { expiresInDays, label });
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to create share link.");
    }
    return apiResponse.data;
};

export const getShareLinks = async (id: number): Promise<ShareLinkItem[]> => {
    const response = await apiClient.get(`/api/videos/${id}/share`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to load share links.");
    }
    return apiResponse.data;
};

export const revokeShareLink = async (id: number, shareId: number): Promise<void> => {
    const response = await apiClient.delete(`/api/videos/${id}/share/${shareId}`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to revoke share link.");
    }
};

export const getPublicVideo = async (token: string): Promise<PublicVideo> => {
    const response = await publicApiClient.get(`/api/share/${token}`);
    const apiResponse = response.data;
    if (!apiResponse.success) {
        throw new Error(apiResponse.message || "This link is no longer available.");
    }
    return apiResponse.data;
};

export const publicStreamUrl = (token: string): string =>
    `${import.meta.env.VITE_API_BASE_URL}/api/share/${token}/stream`;

export const publicThumbnailUrl = (token: string): string =>
    `${import.meta.env.VITE_API_BASE_URL}/api/share/${token}/thumbnail`;

const extractBlobErrorMessage = async (error: any, fallback: string): Promise<string> => {
    const blob = error?.response?.data;
    if (blob instanceof Blob) {
        try {
            const text = await blob.text();
            const parsed = JSON.parse(text);
            if (parsed?.message) return parsed.message;
        } catch {
            // Not JSON -- fall through to the generic message.
        }
    }
    return fallback;
};

export const fetchVideoObjectUrl = async (id: number): Promise<string> => {
    try {
        const response = await apiClient.get(`/api/videos/${id}/stream`, { responseType: "blob" });
        return URL.createObjectURL(response.data);
    } catch (error: any) {
        throw new Error(await extractBlobErrorMessage(error, "Failed to load video."));
    }
};

export const downloadVideo = async (id: number, fileName: string): Promise<void> => {
    try {
        const response = await apiClient.get(`/api/videos/${id}/download`, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName.endsWith(".mp4") ? fileName : `${fileName}.mp4`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        // Revoking immediately can abort the save in Firefox.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
        throw new Error(await extractBlobErrorMessage(error, "Failed to download video."));
    }
};
