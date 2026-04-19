"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MobileNav, MobileNavToggle } from "./mobile-nav";
import { LanguageSelector } from "../language/language-selector";
// import { ModeToggle } from "../theme/mode-toggle";
import { ColorSwitcher } from "../theme/color-switcher";

const navItems = [
  { key: "home", sectionId: "hero" },
  { key: "portfolio", sectionId: "portfolio" },
  { key: "aboutUs", sectionId: "about" },
  { key: "references", sectionId: "referenzen" },
  { key: "contact", sectionId: "kontakt" },
] as const;

export function Header() {
  const t = useTranslations("Header");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => setMobileOpen((prev) => !prev);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">T</span>
            <span className="text-foreground">P</span>
          </span>
        </Link>

        {/* Right side — Nav + Actions */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ key, sectionId }) => (
              <button
                key={key}
                type="button"
                onClick={() => scrollTo(sectionId)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(key)}
              </button>
            ))}
          </nav>
           <ColorSwitcher />
          <LanguageSelector />
          <Link
            href="/"
            className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("shop")}
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
         
          {/* <ModeToggle /> */}
          <MobileNavToggle open={mobileOpen} onToggle={handleToggle} />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav open={mobileOpen} onToggle={handleToggle} />
    </header>
  );
}
