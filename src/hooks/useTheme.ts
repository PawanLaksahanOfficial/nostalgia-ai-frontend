import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const THEME_STORAGE_KEY = "theme";

// keep the DOM attribute and localStorage in sync whenever the user actively changes it via ThemeToggle.
export const useTheme = () => {
  const { theme } = useSelector((state: RootState) => state.style);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);
};
