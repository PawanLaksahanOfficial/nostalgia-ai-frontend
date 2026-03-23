import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const postSocialToken = async (token: string, provider: 'google' | 'meta') => {
    const endpoint = "api/user/socialLoginValidate";
    try {
        const response = await axios.post(baseUrl + endpoint, {
            tokenId: token ,
            provider: provider
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error(`Error during ${provider} authentication:`, error);
        throw error;
    } 
};