"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { routing } from "@/i18n/routing";
import { localeLabels, type Locale } from "./locales";

export function LanguageSelector() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
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

  function switchLocale(locale: Locale) {
    setOpen(false);
    router.replace(pathname, { locale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe className="h-4 w-4" />
        <span>{localeLabels[currentLocale].flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[140px] rounded-lg border border-border bg-popover py-1 shadow-xl">
          {routing.locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchLocale(locale)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                locale === currentLocale
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{localeLabels[locale].flag}</span>
              <span>{localeLabels[locale].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
