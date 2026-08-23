export const header = {
  mobile: {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "var(--color-bg-card)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden"
    },
    logo: {
      fontSize: "1.3rem",
      fontWeight: 700,
      fontFamily: "var(--font-heading)",
      color: "var(--color-text-primary)",
    },
    image: {
      width: "120px",
      height: "34px",
      objectFit: "cover",
      objectPosition: "center",
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    signIn: {
      background: "transparent",
      border: "1px solid var(--color-accent)",
      padding: "0.4rem 0.8rem",
      borderRadius: "8px",
      cursor: "pointer",
      color: "var(--color-accent)",
    },
    profileCircle: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "var(--color-accent)",
      cursor: "pointer",
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    userName: {
      color: "var(--color-text-primary)",
      fontSize: "0.9rem",
      fontWeight: 500,
    },
    signOut: {
      background: "transparent",
      border: "1px solid var(--color-border-strong)",
      padding: "0.4rem 0.8rem",
      borderRadius: "8px",
      cursor: "pointer",
      color: "var(--color-text-primary)",
    },
  },
  desktop: {
    wrapper: {
      padding: "1rem 4rem",
    },
    logo: {
      fontSize: "1.6rem",
    },
    image: {
      width: "150px",
      height: "42px",
      objectFit: "cover",
      objectPosition: "center",
    },
  },
};
