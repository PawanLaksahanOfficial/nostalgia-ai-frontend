export const button = {
  mobile: {
    base: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      transition: "all 0.2s ease-in-out",
      marginTop: "1rem",
    },
    primary: {
      backgroundColor: "var(--color-accent)",
      color: "#fff",
    },
    secondary: {
      backgroundColor: "var(--color-bg-card-alt)",
      color: "var(--color-text-primary)",
      border: "1px solid var(--color-border)",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-accent)",
      border: "1.5px solid var(--color-accent)",
    },
    dangerOutline: {
      backgroundColor: "transparent",
      color: "var(--color-danger)",
      border: "1.5px solid var(--color-danger)",
    },
    disabled: {
      backgroundColor: "var(--color-text-muted)",
      color: "#fff",
      border: "none",
      cursor: "not-allowed",
      opacity: 0.7,
    },
  },
  desktop: {
    base: {
      width: "auto",
      padding: "0.8rem 2rem",
      fontSize: "1.05rem",
    },
  },
};
