import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { Button } from "./Button";

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
                    <Button label="Try Again" type="button" variant="primary" disabled={false} onClick={onRetry} />
                )}
                {onGoHome && (
                    <Button label="Go Home" type="button" variant="outline" disabled={false} onClick={onGoHome} />
                )}
            </div>
        </div>
    );
};
