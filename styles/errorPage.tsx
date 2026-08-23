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
            fontFamily: "var(--font-heading)",
            color: "var(--color-text-primary)",
            marginBottom: "0.5rem",
        },
        message: {
            color: "var(--color-text-secondary)",
            marginBottom: "2rem",
            maxWidth: "400px",
        },
        buttonGroup: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "0.75rem",
        },
    },
    desktop: {
        buttonGroup: {
            flexDirection: "row",
            width: "auto",
        },
    },
};
