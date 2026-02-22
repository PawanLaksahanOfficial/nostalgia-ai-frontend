export const login = {
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
        backgroundOverlay: {
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.4)", // Lightens the busy background
            backdropFilter: "blur(8px)", // Modern "Glass" effect
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
            maxWidth: "420px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "2.5rem 2rem",
            borderRadius: "24px", // More rounded for modern feel
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
        },
        title: {
            fontSize: "2rem",
            fontWeight: "800",
            color: "#1a1a1a",
            letterSpacing: "-0.5px",
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#666",
            fontSize: "0.95rem",
        },
        inputSection: {
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
        },
        forgotLink: {
            fontSize: "0.8rem",
            color: "#4285F4",
            textDecoration: "none",
            fontWeight: 600,
            float: "right",
            marginTop: "4px",
        },
        dividerContainer: {
            display: "flex",
            alignItems: "center",
            margin: "2rem 0",
        },
        dividerLine: { flex: 1, height: "1px", backgroundColor: "#eee" },
        dividerText: { padding: "0 10px", fontSize: "0.75rem", color: "#aaa", fontWeight: 700 },
        socialContainer: {
            wrapper: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Side by side buttons
                gap: "1rem",
            },
            socialButton: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1877F2',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '2px 16px 2px 2px', 
                cursor: 'pointer',
                height: '40px',
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
            },
            iconContainer: {
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
            },
            socialIcon: {
                width: '20px',
                height: '20px',
            },
            buttonText: {
                whiteSpace: 'nowrap',
            }
        },        
        signupText: {
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.9rem",
            color: "#666",
        },
        link: { color: "#000", fontWeight: 700, textDecoration: "none" }
    },
    desktop: {
        card: { padding: "3rem" },
        socialIcon: { width: "24px", height: "24px" }
    }
}