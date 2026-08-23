export const textArea = {
  mobile: {
    container: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    label: { fontSize: "0.9rem", color: "var(--color-text-secondary)", fontWeight: 500 },
    textarea: {
      minHeight: "100px",
      padding: "0.65rem 0.8rem",
      border: "1px solid var(--color-border)",
      borderRadius: "10px",
      backgroundColor: "var(--color-bg-input)",
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-body)",
      resize: "vertical",
    },
  },
  desktop: {
    textarea: {
      minHeight: "150px",
      fontSize: "1rem",
    },
  },
};
