import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import MetaIcon from "../../assets/svg/meta_icon.svg?react";
import { postSocialToken } from "../../services/userServices";
import { useLogin } from 'react-facebook';
import { useState } from 'react';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (userData: any) => void;
}

export const AuthenticationBySocialApps: React.FC<Props> = ({ styles, onSuccess }) => {
    const { login } = useLogin();
    const [isProcessing, setIsProcessing] = useState(false);

    // Generic handler to manage the "Backend Round-trip"
    const handleSocialAuth = async (token: string, provider: 'google' | 'meta') => {
        setIsProcessing(true);
        try {
            const result = await postSocialToken(token, provider);
            if (result && onSuccess) {
                onSuccess(result);
            }
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
        const response = await login({ scope: 'email,public_profile' });
        if (response.authResponse) {
            handleSocialAuth(response.authResponse.accessToken, 'meta');
        }
    };

    return (
        <div style={styles.wrapper}>
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