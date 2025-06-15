
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "classic" | "dark" | "soft" | "vibrant" | "futuristic";
const themes: Theme[] = ["classic", "dark", "soft", "vibrant", "futuristic"];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "classic",
  setTheme: () => {},
  themes,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("app-theme") as Theme) || "classic";
  });

  useEffect(() => {
    document.body.classList.remove(...themes.map(t => `theme-${t}`));
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
