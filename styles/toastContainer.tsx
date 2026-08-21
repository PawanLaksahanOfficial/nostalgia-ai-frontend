export const toastContainer = {
  mobile: {
    wrapper: {
      position: "fixed",
      top: "1rem",
      right: "1rem",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    toastBase: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
      minWidth: "260px",
      maxWidth: "360px",
      padding: "0.9rem 1rem",
      borderRadius: "12px",
      boxShadow: "var(--shadow-card-hover)",
    },
    toastSuccess: {
      backgroundColor: "var(--color-success-soft)",
      border: "1px solid var(--color-success)",
    },
    toastError: {
      backgroundColor: "var(--color-danger-soft)",
      border: "1px solid var(--color-danger)",
    },
    iconSuccess: {
      color: "var(--color-success)",
      fontWeight: 700,
    },
    iconError: {
      color: "var(--color-danger)",
      fontWeight: 700,
    },
    message: {
      flex: 1,
      color: "var(--color-text-primary)",
      fontSize: "0.9rem",
    },
    closeButton: {
      background: "transparent",
      border: "none",
      color: "var(--color-text-muted)",
      cursor: "pointer",
      fontSize: "1rem",
      lineHeight: 1,
      padding: 0,
      borderRadius: "4px",
    },
  },
  desktop: {},
};
