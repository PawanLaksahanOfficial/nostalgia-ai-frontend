export const homePage = {
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
      gap: "1.2rem",
    },
    title: {
      fontSize: "1.6rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      letterSpacing: "-0.5px",
      textAlign: "center",
      color: "var(--color-text-primary)",
    },
    subtext: {
      fontSize: "0.9rem",
      textAlign: "center",
      color: "var(--color-text-secondary)",
      marginBottom: "0.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
  },

  desktop: {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "var(--color-bg-page)",
      padding: "2rem 4rem",
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "1rem",
    },
    card: {
      backgroundColor: "var(--color-bg-card)",
      width: "60%",
      maxWidth: "700px",
      borderRadius: "24px",
      padding: "2.5rem",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      transition: "0.3s ease",
    },
    title: {
      fontSize: "2.2rem",
    },
    subtext: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
    },
  },
};
