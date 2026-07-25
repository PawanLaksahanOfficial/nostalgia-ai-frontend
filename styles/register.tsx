export const register = {
    mobile: {
        wrapper: {
            minHeight: "100vh",
            backgroundImage: "url(/images/nostalgic_image.avif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            position: "relative",
        },
        content: {
            zIndex: 1,
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem",
        },
        card: {
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "2.5rem 2rem",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
        },
        title: {
            fontSize: "1.8rem",
            fontWeight: "800",
            color: "#1a1a1a",
            textAlign: "center",
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#666",
            fontSize: "0.95rem",
            textAlign: "center",
            marginBottom: "2rem",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        },
        dividerContainer: {
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
        },
        dividerLine: { flex: 1, height: "1px", backgroundColor: "#eee" },
        dividerText: { padding: "0 10px", fontSize: "0.75rem", color: "#aaa", fontWeight: 700 },
        socialContainer: {
            wrapper: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
            }
        },
        loginText: {
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "#666",
        },
        link: { color: "#4285F4", fontWeight: 700, textDecoration: "none" }
    },
    desktop: {
        card: { padding: "3rem" },
        title: { fontSize: "2.2rem" }
    }
};