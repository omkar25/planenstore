"use client";

import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

const navItems = [
  { key: "home", sectionId: "hero" },
  { key: "portfolio", sectionId: "portfolio" },
  { key: "aboutUs", sectionId: "about" },
  { key: "references", sectionId: "referenzen" },
  { key: "contact", sectionId: "kontakt" },
] as const;

interface MobileNavProps {
  open: boolean;
  onToggle: () => void;
}

export function MobileNavToggle({ open, onToggle }: MobileNavProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  );
}

export function MobileNav({ open, onToggle }: MobileNavProps) {
  const t = useTranslations("Header");

  if (!open) return null;

  return (
    <nav className="flex flex-col gap-1 border-t border-border bg-background px-6 py-4 md:hidden">
      {navItems.map(({ key, sectionId }) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            onToggle();
          }}
          className="rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t(key)}
        </button>
      ))}
    </nav>
  );
}
