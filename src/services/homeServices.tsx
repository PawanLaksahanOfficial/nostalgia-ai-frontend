import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const generate = async (text: string, image?: File | null) => {
    try {
        const formData = new FormData();
        formData.append("Text", text);
        if (image) formData.append("Image", image);

        const response = await axios.post(
            baseUrl + "/api/memories/generate", 
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error generating nostalgia:", error);
        return null;
    }
};

export const createMemoryVideo = async (title: string, storyText: string, musicMood?: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + "/api/memories/create",
            { title, storyText, musicMood },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating memory video:", error);
        throw error;
    }
};

export const getMemoryStatus = async (jobId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + `/api/memories/status/${jobId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting memory status:", error);
        return null;
    }
};

export const getMyMemories = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + "/api/memories/my",
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching memories:", error);
        return [];
    }
};

export const shareMemory = async (memoryId: number, expirationDays?: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + `/api/memories/${memoryId}/share`,
            { expirationDays },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error sharing memory:", error);
        throw error;
    }
};

export const unshareMemory = async (memoryId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            baseUrl + `/api/memories/${memoryId}/share`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error unsharing memory:", error);
        throw error;
    }
};

export const deleteMemory = async (memoryId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            baseUrl + `/api/memories/${memoryId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting memory:", error);
        throw error;
    }
};

export const regenerateMemory = async (memoryId: number, newStoryText?: string, newMusicMood?: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + `/api/memories/${memoryId}/regenerate`,
            { newStoryText, newMusicMood },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error regenerating memory:", error);
        throw error;
    }
};

export const getPublicMemories = async () => {
    try {
        const response = await axios.get(baseUrl + "/api/memories/public");
        return response.data;
    } catch (error) {
        console.error("Error fetching public memories:", error);
        return [];
    }
};

export const getSharedMemory = async (token: string) => {
    try {
        const response = await axios.get(baseUrl + `/api/memories/share/${token}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shared memory:", error);
        return null;
    }
};

export const downloadVideo = async (memoryId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(baseUrl + `/api/memories/${memoryId}/download`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading video:", error);
        throw error;
    }
};
