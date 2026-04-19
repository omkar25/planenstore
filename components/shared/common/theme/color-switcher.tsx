"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Palette, Check, Sun, Moon } from "lucide-react";
import { colorThemes } from "./color-themes";
import { useColorTheme } from "./color-context";

export function ColorSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border border-border bg-popover py-1 shadow-xl">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border mb-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors ${
                resolvedTheme === "light"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors ${
                resolvedTheme === "dark"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
          </div>

          {/* Color themes */}
          {colorThemes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => {
                setColorTheme(theme.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                colorTheme === theme.value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full ${theme.preview}`}
              />
              <span className="flex-1">{theme.name}</span>
              {colorTheme === theme.value && (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
