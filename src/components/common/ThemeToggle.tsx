import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setTheme } from "../../redux/styleSlice";
import { useComponentStyle } from "../../hooks/useComponentStyle";

export const ThemeToggle: React.FC = () => {
  const Styles = useComponentStyle("themeToggle");
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.style);

  const toggle = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      className="icon-btn"
      style={Styles.button}
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <svg style={Styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg style={Styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};
