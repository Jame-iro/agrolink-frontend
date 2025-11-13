import { useState, useEffect } from "react";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("agrilink-dark-mode");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (saved !== null) {
      setIsDark(saved === "true");
    } else {
      setIsDark(systemPrefersDark);
    }
  }, []);

  // Apply dark class to html element and save to localStorage
  useEffect(() => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("agrilink-dark-mode", isDark.toString());
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return {
    isDark,
    toggleDarkMode,
    setIsDark,
  };
};
