export const profile = {
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
    title: {
      fontSize: "1.6rem",
      fontWeight: 800,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
      marginBottom: "1.5rem",
    },
    section: {
      marginBottom: "2rem",
      paddingBottom: "1.5rem",
      borderBottom: "1px solid var(--color-border)",
    },
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "var(--color-text-primary)",
      marginBottom: "1rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    fieldRow: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginTop: "0.5rem",
    },
    infoDisplay: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    premiumBadge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      backgroundColor: "var(--color-highlight-soft)",
      color: "var(--color-text-primary)",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    freeBadge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      backgroundColor: "var(--color-bg-card-alt)",
      color: "var(--color-text-secondary)",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    quotaDisplay: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    quotaItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    quotaLabel: {
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
    },
    quotaValue: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "var(--color-text-primary)",
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "var(--color-bg-card-alt)",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "var(--color-accent)",
      transition: "width 0.3s ease",
    },
    watermarkNote: {
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
      fontStyle: "italic",
    },
    memoryList: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    memoryItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "0.75rem",
      padding: "1rem",
      backgroundColor: "var(--color-bg-card-alt)",
      borderRadius: "12px",
    },
    memoryInfo: {
      flex: 1,
    },
    memoryTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "var(--color-text-primary)",
      marginBottom: "0.25rem",
    },
    memoryMeta: {
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
      marginBottom: "0.5rem",
    },
    statusBadge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#ffffff",
    },
    footer: {
      marginTop: "2rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid var(--color-border)",
      textAlign: "center" as const,
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontSize: "1.125rem",
      color: "var(--color-text-secondary)",
    },
    error: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontSize: "1.125rem",
      color: "var(--color-danger)",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "2rem",
      color: "var(--color-text-secondary)",
    },
  },
  desktop: {
    wrapper: {
      padding: "2rem",
    },
    content: {
      maxWidth: "760px",
      margin: "0 auto",
    },
    card: {
      padding: "2rem",
    },
    title: {
      fontSize: "2rem",
    },
    fieldRow: {
      flexDirection: "row",
    },
    buttonGroup: {
      flexDirection: "row",
    },
    memoryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
};
