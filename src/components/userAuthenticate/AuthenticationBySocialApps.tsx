import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import MetaIcon from "../../assets/svg/meta_icon.svg?react";
import { postSocialToken, getProfile } from "../../services/userServices";
import { useLogin } from 'react-facebook';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

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

    // Generic handler to manage the "Backend Round-trip"
    const handleSocialAuth = async (token: string, provider: 'google' | 'meta') => {
        setIsProcessing(true);
        setError("");
        try {
            const result = await postSocialToken(token, provider);
            const profile = await getProfile();
            dispatch(setCredentials({
                token: result.token,
                user: {
                    userId: profile.userId,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    avatarUrl: profile.avatarUrl,
                    tier: profile.tier,
                    monthlyMemoriesUsed: profile.quota.monthlyMemoriesUsed,
                    monthlyMemoriesLimit: profile.quota.monthlyMemoriesLimit,
                }
            }));
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
            {/* Google Button */}
            <div style={{ opacity: isProcessing ? 0.6 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    useOneTap
                    theme="filled_blue"
                    shape="pill"
                    text="continue_with"
                />
            </div>
            {/* Meta Button */}
            <button
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
