export const watchPage = {
  mobile: {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "var(--color-bg-page)",
    },
    content: {
      flex: 1,
      padding: "1.2rem",
      marginTop: "1rem",
    },
    card: {
      backgroundColor: "var(--color-bg-card)",
      borderRadius: "20px",
      padding: "1.5rem",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
      margin: 0,
    },
    subtext: {
      fontSize: "0.9rem",
      color: "var(--color-text-secondary)",
      margin: 0,
    },
    video: {
      width: "100%",
      borderRadius: "12px",
      backgroundColor: "#000",
    },
    narrative: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
      color: "var(--color-text-secondary)",
      fontStyle: "italic",
    },
    footerRow: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "center",
      marginTop: "0.5rem",
    },
    viewCount: {
      fontSize: "0.85rem",
      color: "var(--color-text-muted)",
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontSize: "1.125rem",
      color: "var(--color-text-secondary)",
    },
  },
  desktop: {
    content: {
      display: "flex",
      justifyContent: "center",
      paddingTop: "1rem",
    },
    card: {
      width: "70%",
      maxWidth: "800px",
      padding: "2.5rem",
    },
    title: {
      fontSize: "2rem",
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
};
