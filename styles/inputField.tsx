export const inputField = {
  mobile: {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flex: "1 1 0%",
      minWidth: 0,
      position: "relative",
    },
    label: { fontSize: "0.9rem", color: "var(--color-text-secondary)", fontWeight: 500 },
    input: {
      width: "100%",
      padding: "0.65rem 0.8rem",
      borderRadius: "10px",
      border: "1px solid var(--color-border)",
      backgroundColor: "var(--color-bg-input)",
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-body)",
    },
    passwordInput: {
      paddingRight: "2.6rem",
    },
    passwordEye: {
      position: "absolute",
      right: "0.8rem",
      top: "2.4rem",
      width: "20px",
      height: "20px",
      cursor: "pointer",
      color: "var(--color-text-secondary)",
      opacity: 0.9,
      hidden: { opacity: 0.5 },
    },
    errorIndicator: {
      errorIcon: {
        width: "18px",
        height: "18px",
        cursor: "pointer",
        color: "var(--color-danger, #dc2626)",
      },
      popUp: {
        wrapper: {
          marginTop: "0.35rem",
          padding: "0.4rem 0.6rem",
          borderRadius: "8px",
          backgroundColor: "var(--color-danger, #dc2626)",
          color: "#ffffff",
          fontSize: "0.75rem",
          lineHeight: 1.4,
          maxWidth: "260px",
        },
      },
    },
  },
  desktop: {
    input: {
      fontSize: "1rem",
      padding: "0.8rem 1rem",
    },
    passwordInput: {
      paddingRight: "2.8rem",
    },
    passwordEye: {
      top: "2.55rem",
    },
  },
};
