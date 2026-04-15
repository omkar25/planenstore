"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MobileNav, MobileNavToggle } from "./mobile-nav";
import { LanguageSelector } from "../language/language-selector";
// import { ModeToggle } from "../theme/mode-toggle";
import { ColorSwitcher } from "../theme/color-switcher";

const navKeys = ["home", "portfolio", "aboutUs", "references", "contact"] as const;

export function Header() {
  const t = useTranslations("Header");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => setMobileOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a] border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-lime-400">T</span>
            <span className="text-white">P</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navKeys.map((key) => (
            <Link
              key={key}
              href="/"
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side — Shop button + Cart + Mobile toggle */}
        <div className="flex items-center gap-3">
           <ColorSwitcher />
          <LanguageSelector />
          <Link
            href="/"
            className="rounded-full bg-lime-400 px-5 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-lime-300"
          >
            {t("shop")}
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-colors hover:text-white"
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
