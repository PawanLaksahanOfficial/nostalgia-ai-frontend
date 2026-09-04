export const videosPage = {
  mobile: {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: "var(--color-bg-page)",
      padding: "1rem",
    },
    content: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "var(--color-bg-card)",
      borderRadius: "16px",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      padding: "1.5rem",
    },
    titleRow: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "1.6rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
      margin: 0,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 1rem",
      color: "var(--color-text-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "center",
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
    wrapper: {
      padding: "2rem",
    },
    content: {
      maxWidth: "760px",
    },
    card: {
      padding: "2rem",
    },
    title: {
      fontSize: "2rem",
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
};
