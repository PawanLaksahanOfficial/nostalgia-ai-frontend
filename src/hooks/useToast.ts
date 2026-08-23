import { useDispatch } from "react-redux";
import { addToast } from "../redux/toastSlice";

export const useToast = () => {
    const dispatch = useDispatch();

    return {
        success: (message: string) => dispatch(addToast({ type: "success", message })),
        error: (message: string) => dispatch(addToast({ type: "error", message })),
    };
};
