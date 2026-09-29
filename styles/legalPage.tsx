export const legalPage = {
  mobile: {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "var(--color-bg-page)",
    },
    content: {
      flex: 1,
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "1rem",
    },
    card: {
      backgroundColor: "var(--color-bg-card)",
      borderRadius: "16px",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      padding: "1.5rem",
    },
    title: {
      margin: "0 0 0.4rem",
      fontSize: "1.8rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
    },
    updated: {
      margin: "0 0 1.5rem",
      fontSize: "0.85rem",
      color: "var(--color-text-muted)",
    },
    heading: {
      margin: "1.75rem 0 0.6rem",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "var(--color-text-primary)",
    },
    paragraph: {
      margin: "0 0 0.75rem",
      fontSize: "0.95rem",
      lineHeight: 1.7,
      color: "var(--color-text-secondary)",
    },
    list: {
      margin: "0 0 0.75rem",
      paddingLeft: "1.25rem",
      fontSize: "0.95rem",
      lineHeight: 1.7,
      color: "var(--color-text-secondary)",
    },
    strong: {
      color: "var(--color-text-primary)",
      fontWeight: 600,
    },
  },
  desktop: {
    content: {
      padding: "2rem 0",
      maxWidth: "760px",
    },
    card: {
      padding: "2.5rem",
    },
    title: {
      fontSize: "2.4rem",
    },
  },
};
