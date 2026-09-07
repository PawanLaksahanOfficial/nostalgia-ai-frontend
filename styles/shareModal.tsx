export const shareModal = {
  mobile: {
    createRow: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    select: {
      width: "100%",
      padding: "0.7rem 0.9rem",
      borderRadius: "10px",
      border: "1px solid var(--color-border)",
      backgroundColor: "var(--color-bg-input)",
      color: "var(--color-text-primary)",
      fontSize: "0.9rem",
    },
    emptyState: {
      textAlign: "center",
      color: "var(--color-text-secondary)",
      padding: "1rem 0",
    },
    linkList: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    linkItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      padding: "0.9rem",
      backgroundColor: "var(--color-bg-card-alt)",
      borderRadius: "12px",
    },
    linkRow: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    linkInput: {
      width: "100%",
      fontSize: "0.8rem",
      color: "var(--color-text-secondary)",
    },
    linkMeta: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "0.6rem",
    },
    metaText: {
      fontSize: "0.8rem",
      color: "var(--color-text-muted)",
    },
    statusActive: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "var(--color-success)",
      padding: "0.15rem 0.6rem",
      borderRadius: "9999px",
      backgroundColor: "var(--color-success-soft)",
    },
    statusDead: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "var(--color-text-muted)",
      padding: "0.15rem 0.6rem",
      borderRadius: "9999px",
      backgroundColor: "var(--color-bg-page-alt)",
    },
  },
  desktop: {
    createRow: {
      flexDirection: "row",
    },
    select: {
      width: "auto",
      flex: 1,
    },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
};
