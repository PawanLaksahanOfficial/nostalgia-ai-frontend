export const footer = {
  mobile: {
    wrapper: {
      marginTop: "3rem",
      backgroundColor: "var(--color-bg-card)",
      borderTop: "1px solid var(--color-border)",
    },
    accentBar: {
      height: "3px",
      background: "linear-gradient(90deg, var(--color-accent), var(--color-highlight), var(--color-accent))",
    },
    inner: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "2rem",
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "2.25rem 1.25rem 1.75rem",
    },
    brand: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.75rem",
      maxWidth: "360px",
    },
    logoLink: {
      display: "inline-flex",
    },
    logo: {
      width: "130px",
      height: "37px",
      objectFit: "cover",
      objectPosition: "center",
    },
    tagline: {
      margin: 0,
      fontSize: "0.9rem",
      lineHeight: 1.6,
      color: "var(--color-text-secondary)",
    },
    columns: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      width: "100%",
      maxWidth: "340px",
    },
    columnTitle: {
      margin: "0 0 0.8rem",
      fontFamily: "var(--font-body)",
      fontSize: "0.72rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--color-text-muted)",
    },
    list: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
    },
    bottomWrap: {
      borderTop: "1px solid var(--color-border)",
    },
    bottomBar: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.75rem",
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "1rem 1.25rem 1.5rem",
    },
    copyright: {
      margin: 0,
      fontSize: "0.8rem",
      color: "var(--color-text-muted)",
      textAlign: "center",
    },
    legalLink: {
      fontSize: "0.8rem",
    },
  },
  desktop: {
    inner: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      textAlign: "left",
      padding: "3rem 4rem 2.25rem",
    },
    brand: {
      alignItems: "flex-start",
      maxWidth: "380px",
    },
    logo: {
      width: "150px",
      height: "42px",
    },
    columns: {
      gridTemplateColumns: "repeat(2, minmax(150px, auto))",
      gap: "4rem",
      width: "auto",
      maxWidth: "none",
    },
    bottomBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "1.1rem 4rem",
    },
  },
};
