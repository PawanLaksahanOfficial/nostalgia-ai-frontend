import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import MetaIcon from "../../assets/svg/meta_icon.svg?react";
import { postSocialToken } from "../../services/userServices";
import { useLogin } from 'react-facebook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (userData: any) => void;
}

export const AuthenticationBySocialApps: React.FC<Props> = ({ styles, onSuccess }) => {
    const { login } = useLogin();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state: RootState) => state.style);

    const handleSocialAuth = async (token: string, provider: 'google' | 'meta') => {
        setIsProcessing(true);
        setError("");
        try {
            const result = await postSocialToken(token, provider);
            dispatch(setCredentials({ token: result.token, user: result.user }));
            if (onSuccess) {
                onSuccess(result);
            }
            navigate('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : `${provider} authentication failed.`;
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGoogleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            handleSocialAuth(response.credential, 'google');
        }
    };

    const handleGoogleError = () => {
        setError("Google sign-in was cancelled or failed. Please try again.");
    };

    const handleMetaLogin = async () => {
        try {
            const response = await login({ scope: 'email,public_profile' });
            if (response.authResponse) {
                handleSocialAuth(response.authResponse.accessToken, 'meta');
            }
        } catch {
            setError("Meta login failed. Please try again.");
        }
    };

    return (
        <div style={styles.wrapper}>
            {error && (
                <div style={styles.socialErrorAlert}>
                    {error}
                </div>
            )}
            <div style={{ ...styles.googleWrapper, opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme={theme === "dark" ? "filled_black" : "filled_blue"}
                    shape="pill"
                    text="continue_with"
                />
            </div>
            <button
                className="btn-social"
                style={{...styles.socialButton, opacity: isProcessing ? 0.6 : 1}}
                onClick={handleMetaLogin}
                disabled={isProcessing}
            >
                <div style={styles.iconContainer}>
                    <MetaIcon style={styles.socialIcon}/>
                </div>
                <span style={styles.buttonText}>
                    {isProcessing ? 'Verifying...' : 'Continue with Meta'}
                </span>
            </button>
        </div>
    );
};
