export const pricing = {
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
    },
    header: {
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "1.7rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      letterSpacing: "-0.5px",
      color: "var(--color-text-primary)",
    },
    subtitle: {
      fontSize: "0.9rem",
      color: "var(--color-text-secondary)",
      marginTop: "0.5rem",
    },
    planGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
    },
    planCard: {
      backgroundColor: "var(--color-bg-card)",
      borderRadius: "20px",
      padding: "1.5rem",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    planCardFeatured: {
      border: "2px solid var(--color-accent)",
    },
    planName: {
      fontSize: "1.2rem",
      fontWeight: 700,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
    },
    planPrice: {
      fontSize: "2rem",
      fontWeight: 800,
      color: "var(--color-text-primary)",
    },
    planInterval: {
      fontSize: "0.9rem",
      fontWeight: 500,
      color: "var(--color-text-secondary)",
    },
    featureList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    },
    featureItem: {
      fontSize: "0.9rem",
      color: "var(--color-text-secondary)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    currentBadge: {
      alignSelf: "flex-start",
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      padding: "0.25rem 0.6rem",
      borderRadius: "999px",
      backgroundColor: "var(--color-accent)",
      color: "#fff",
    },
    errorAlert: {
      padding: "0.75rem",
      marginBottom: "1rem",
      borderRadius: "8px",
      backgroundColor: "var(--color-danger-soft)",
      color: "var(--color-danger)",
      border: "1px solid var(--color-danger)",
    },
    loadingText: {
      textAlign: "center",
      color: "var(--color-text-secondary)",
      padding: "2rem",
    },
  },

  desktop: {
    content: {
      padding: "2rem 4rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontSize: "2.4rem",
    },
    subtitle: {
      fontSize: "1rem",
    },
    planGrid: {
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "center",
      gap: "1.5rem",
      width: "100%",
      maxWidth: "820px",
    },
    planCard: {
      flex: 1,
      padding: "2rem",
    },
  },
};
