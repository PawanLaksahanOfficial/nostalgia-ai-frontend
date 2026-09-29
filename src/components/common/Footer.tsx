import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useComponentStyle } from "../../hooks/useComponentStyle";

export const Footer: React.FC = () => {
  const Styles = useComponentStyle("footer");
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={Styles.wrapper}>
      <div style={Styles.accentBar} aria-hidden="true" />
      <div style={Styles.inner}>
        <div style={Styles.brand}>
          <Link to="/" style={Styles.logoLink} aria-label="Nostalgia AI home">
            <img src="/images/logo.png" alt="Nostalgia AI" style={Styles.logo} />
          </Link>
          <p style={Styles.tagline}>
            Turn the moments you never want to forget into narrated,
            captioned keepsake videos you can watch, download and share.
          </p>
        </div>

        <nav style={Styles.columns} aria-label="Footer">
          <div>
            <h3 style={Styles.columnTitle}>Create</h3>
            <ul style={Styles.list}>
              <li><Link to="/" className="footer-link">Create a video</Link></li>
              {isAuthenticated && <li><Link to="/videos" className="footer-link">My Videos</Link></li>}
              <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={Styles.columnTitle}>Account</h3>
            <ul style={Styles.list}>
              {isAuthenticated ? (
                <li><Link to="/profile" className="footer-link">Your profile</Link></li>
              ) : (
                <>
                  <li><Link to="/signIn" className="footer-link">Sign in</Link></li>
                  <li><Link to="/register" className="footer-link">Create account</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>

      <div style={Styles.bottomWrap}>
        <div style={Styles.bottomBar}>
          <p style={Styles.copyright}>
            © {year} Nostalgia AI. All rights reserved. ·{" "}
            <Link to="/privacy" className="footer-link" style={Styles.legalLink}>Privacy Policy</Link>
          </p>
          <button type="button" className="footer-top-btn" onClick={scrollToTop}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
