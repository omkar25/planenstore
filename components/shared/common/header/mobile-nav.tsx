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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:text-white md:hidden"
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  );
}

export function MobileNav({ open, onToggle }: MobileNavProps) {
  const t = useTranslations("Header");

  if (!open) return null;

  return (
    <nav className="flex flex-col gap-1 border-t border-white/5 px-6 py-4 md:hidden">
      {navItems.map(({ key, sectionId }) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            onToggle();
          }}
          className="rounded-lg px-3 py-2 text-left text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          {t(key)}
        </button>
      ))}
    </nav>
  );
}
