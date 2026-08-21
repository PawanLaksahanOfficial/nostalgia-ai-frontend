export const inputField = {
  mobile: {
    container: { display: "flex", flexDirection: "column", gap: "0.5rem", flex: "1 1 0%", minWidth: 0 },
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
  },
  desktop: {
    input: {
      fontSize: "1rem",
      padding: "0.8rem 1rem",
    },
  },
};
