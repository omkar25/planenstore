"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
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
  const tCart = useTranslations("Cart");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const handleToggle = () => setMobileOpen((prev) => !prev);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.sectionId);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex h-14 w-full items-center justify-between px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/tori_planen.png"
            alt="Tori Planen"
            width={100}
            height={100}
            style={{ width: "auto", height: "2.0rem" }}
            className="object-contain"
            priority
          />
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
                className={`text-sm transition-colors hover:text-primary ${
                  activeSection === sectionId
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground"
                }`}
              >
                {t(key)}
              </button>
            ))}
          </nav>
          <ColorSwitcher />
          <LanguageSelector />
          <Link
            href="/shop"
            className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {t("shop")}
          </Link>
          <button
            type="button"
            onClick={() => toast(tCart("comingSoon"), { style: { background: "var(--primary)", color: "#fff" } })}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
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
