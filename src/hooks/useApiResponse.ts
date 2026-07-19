import { useState, useCallback } from "react";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    errors: string[] | null;
}

export function useApiResponse() {
    const [pageError, setPageError] = useState<string | null>(null);

    const handleResponse = useCallback(<T,>(response: ApiResponse<T>): T | null => {
        if (!response.success) {
            setPageError(response.message);
            return null;
        }
        return response.data;
    }, []);

    const clearError = useCallback(() => {
        setPageError(null);
    }, []);

    return { pageError, handleResponse, clearError };
}