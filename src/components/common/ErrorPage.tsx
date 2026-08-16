import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";

interface ErrorPageProps {
    message: string;
    onRetry?: () => void;
    onGoHome?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry, onGoHome }) => {
    const Styles = useComponentStyle("errorPage");

    return (
        <div style={Styles.container}>
            <div style={Styles.icon}>⚠️</div>
            <h1 style={Styles.heading}>Something went wrong</h1>
            <p style={Styles.message}>{message}</p>
            <div style={Styles.buttonGroup}>
                {onRetry && (
                    <button onClick={onRetry} style={Styles.retryButton}>
                        Try Again
                    </button>
                )}
                {onGoHome && (
                    <button onClick={onGoHome} style={Styles.homeButton}>
                        Go Home
                    </button>
                )}
            </div>
        </div>
    );
};