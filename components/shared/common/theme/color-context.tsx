"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { defaultColorTheme } from "./color-themes";

interface ColorContextValue {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
}

const ColorContext = createContext<ColorContextValue>({
  colorTheme: defaultColorTheme,
  setColorTheme: () => {},
});

const STORAGE_KEY = "color-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return defaultColorTheme;
  return localStorage.getItem(STORAGE_KEY) ?? defaultColorTheme;
}

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-theme", colorTheme);
    localStorage.setItem(STORAGE_KEY, colorTheme);
  }, [colorTheme]);

  const setColorTheme = useCallback((theme: string) => {
    setColorThemeState(theme);
  }, []);

  return (
    <ColorContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorContext);
}
