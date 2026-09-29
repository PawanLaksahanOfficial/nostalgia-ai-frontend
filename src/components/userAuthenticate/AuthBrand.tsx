import React from "react";
import { Link } from "react-router-dom";
import { useComponentStyle } from "../../hooks/useComponentStyle";

export const AuthBackLink: React.FC = () => {
  const Styles = useComponentStyle("authBrand");

  return (
    <nav style={Styles.topBar} aria-label="Back">
      <Link to="/" className="auth-back-link">
        <svg
          className="auth-back-link-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to home
      </Link>
    </nav>
  );
};

// Brand mark at the top of each auth card; also links home.
export const AuthBrand: React.FC = () => {
  const Styles = useComponentStyle("authBrand");

  return (
    <Link to="/" style={Styles.link} aria-label="Nostalgia AI home">
      <img src="/images/logo.png" alt="Nostalgia AI" style={Styles.image} />
    </Link>
  );
};
