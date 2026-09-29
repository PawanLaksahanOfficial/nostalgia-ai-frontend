import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import MetaIcon from "../../assets/svg/meta_icon.svg?react";
import { postSocialToken } from "../../services/userServices";
import { useLogin } from 'react-facebook';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import {
    clampSocialButtonWidth,
    isGoogleAuthEnabled,
    isMetaAuthEnabled,
} from "../helpers/socialAuth";

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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [buttonWidth, setButtonWidth] = useState<number | null>(null);

    useLayoutEffect(() => {
        const element = wrapperRef.current;
        if (!element) return;
        const update = () => {
            const available = element.getBoundingClientRect().width;
            if (available > 0) setButtonWidth(clampSocialButtonWidth(available));
        };
        update();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

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

    if (!isGoogleAuthEnabled && !isMetaAuthEnabled) {
        return null;
    }

    return (
        <div ref={wrapperRef} style={styles.wrapper}>
            {error && (
                <div style={styles.socialErrorAlert}>
                    {error}
                </div>
            )}
            {isGoogleAuthEnabled && buttonWidth !== null && (
                <div style={{ ...styles.googleWrapper, opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme={theme === "dark" ? "filled_black" : "filled_blue"}
                        shape="pill"
                        text="continue_with"
                        width={buttonWidth}
                    />
                </div>
            )}
            {isMetaAuthEnabled && (
                <button
                    type="button"
                    className="btn-social"
                    style={{ ...styles.socialButton, width: buttonWidth !== null ? `${buttonWidth}px` : '100%', opacity: isProcessing ? 0.6 : 1 }}
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
            )}
        </div>
    );
};
