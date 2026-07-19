import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import MetaIcon from "../../assets/svg/meta_icon.svg?react";
import { postSocialToken, getProfile } from "../../services/userServices";
import { useLogin } from 'react-facebook';
import { useState } from 'react';

interface Props {
    styles: any;
    onSuccess?: (userData: any) => void;
}

export const AuthenticationBySocialApps: React.FC<Props> = ({ styles, onSuccess }) => {
    const { login } = useLogin();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSocialAuth = async (token: string, provider: 'google' | 'meta') => {
        setIsProcessing(true);
        setError("");
        try {
            const result = await postSocialToken(token, provider);
            if (result && result.token) {
                try {
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
                            monthlyMemoriesLimit: profile.quota.monthlyMemoriesLimit
                        }
                    }));
                } catch {
                    dispatch(setCredentials({
                        token: result.token,
                        user: {
                            userId: 0,
                            firstName: "",
                            lastName: "",
                            email: "",
                            avatarUrl: null,
                            tier: "free",
                            monthlyMemoriesUsed: 0,
                            monthlyMemoriesLimit: 3
                        }
                    }));
                }

                if (onSuccess) {
                    onSuccess(result);
                }
                navigate('/');
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                `${provider} authentication failed.`
            );
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
        } catch (err: any) {
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
            <div style={isProcessing ? styles.processingOverlay : {}}>
                <GoogleLogin 
                    onSuccess={handleGoogleSuccess} 
                    useOneTap
                    theme="filled_blue"
                    shape="pill"
                    text="continue_with"
                />
            </div>
            <button 
                style={{...styles.socialButton, ...(isProcessing ? styles.socialButtonDisabled : {})}}
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