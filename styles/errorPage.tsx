export const errorPage = {
    mobile: {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "2rem",
            textAlign: "center" as const,
        },
        icon: {
            fontSize: "4rem",
            marginBottom: "1rem",
        },
        heading: {
            fontSize: "1.5rem",
            color: "#333",
            marginBottom: "0.5rem",
        },
        message: {
            color: "#666",
            marginBottom: "2rem",
            maxWidth: "400px",
        },
        buttonGroup: {
            display: "flex",
            gap: "1rem",
        },
        retryButton: {
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
        },
        homeButton: {
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
        },
    },
    desktop: {},
};