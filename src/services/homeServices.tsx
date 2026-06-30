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

export const toggleLike = async (memoryId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + `/api/social/memories/${memoryId}/like`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

export const getComments = async (memoryId: number) => {
    try {
        const response = await axios.get(baseUrl + `/api/social/memories/${memoryId}/comments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
};

export const addComment = async (memoryId: number, text: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + `/api/social/memories/${memoryId}/comments`,
            { text },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const deleteComment = async (commentId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            baseUrl + `/api/social/comments/${commentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

export const createCollection = async (name: string, description?: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + '/api/social/collections',
            { name, description },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating collection:", error);
        throw error;
    }
};

export const getMyCollections = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + '/api/social/collections',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
    }
};

export const addMemoryToCollection = async (collectionId: number, memoryId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + `/api/social/collections/${collectionId}/memories`,
            { memoryId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding memory to collection:", error);
        throw error;
    }
};

export const getMemoriesInCollection = async (collectionId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + `/api/social/collections/${collectionId}/memories`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching collection memories:", error);
        return [];
    }
};

export const sendGift = async (memoryId: number, recipientEmail: string, message?: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            baseUrl + '/api/social/gifts',
            { memoryId, recipientEmail, message },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error sending gift:", error);
        throw error;
    }
};

export const getSentGifts = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + '/api/social/gifts/sent',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching sent gifts:", error);
        return [];
    }
};

export const getReceivedGifts = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            baseUrl + '/api/social/gifts/received',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching received gifts:", error);
        return [];
    }
};

export const getDailyPrompt = async () => {
    try {
        const response = await axios.get(baseUrl + '/api/social/prompts/daily');
        return response.data;
    } catch (error) {
        console.error("Error fetching daily prompt:", error);
        return null;
    }
};
