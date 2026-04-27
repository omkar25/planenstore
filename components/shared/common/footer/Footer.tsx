"use client";

import { useState, useEffect } from "react";
import { HiArrowUp, HiX } from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaWeixin,
  FaTiktok,
  FaPinterestP,
  FaWhatsapp,
} from "react-icons/fa6";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/navigation";

const navLinks = [
  { key: "home", id: "hero" },
  { key: "portfolio", id: "portfolio" },
  { key: "aboutUs", id: "about" },
  { key: "references", id: "referenzen" },
  { key: "contact", id: "kontakt" },
] as const;

const serviceKeys = ["pvc", "dust", "blast", "weather", "custom"] as const;

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook", color: "#1877F2", bg: "#1877F2" },
  { icon: FaInstagram, href: "https://www.instagram.com/tori_planen/", label: "Instagram", color: "#E4405F", bg: "#E4405F" },
  { icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000", bg: "#FF0000" },
  { icon: FaXTwitter, href: "#", label: "X", color: "#000000", bg: "#000000" },
  { icon: FaWhatsapp, href: "https://api.whatsapp.com/send/?phone=4917610319001&text&type=phone_number&app_absent=0", label: "WhatsApp", color: "#25D366", bg: "#25D366" },
];

export default function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");
  const [showWeChatQR, setShowWeChatQR] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div>
            <div className="h-5 flex items-center mb-6">
              <Image
                src="/logo/logo-old.png"
                alt="TORİ Planen & Netze"
                width={180}
                height={60}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("brandDescription")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 h-1 flex items-center">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      if (pathname !== "/") {
                        router.push(`/#${link.id}`);
                        return;
                      }
                      document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {tHeader(link.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 h-5 flex items-center">{t("services")}</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {serviceKeys.map((key) => (
                <li key={key}>{t(`servicesList.${key}`)}</li>
              ))}
            </ul>
          </div>

          {/* Social & WeChat */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 h-5 flex items-center">{t("followUs")}</h4>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {socialLinks.map(({ icon: Icon, href, label, color, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 hover:shadow-md"
                  style={{
                    color: color,
                    borderColor: color + "30",
                    backgroundColor: bg + "10",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = bg + "25";
                    e.currentTarget.style.borderColor = color + "60";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = bg + "10";
                    e.currentTarget.style.borderColor = color + "30";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar – full-width line */}
      <div className="mt-0 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TORİ {t("brandName")}. {t("copyright")}
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/impressum"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("imprint")}
            </Link>
            <Link
              href="/datenschutz"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("privacy")}
            </Link>

          </div>
        </div>
      </div>

      {/* Fixed floating buttons – bottom right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowWeChatQR(true)}
          className="w-12 h-12 bg-[#07C160] hover:bg-[#06a853] rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
          aria-label="WeChat"
        >
          <FaWeixin className="w-5 h-5" />
        </button>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
            aria-label={t("scrollTop")}
          >
            <HiArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* WeChat QR Modal */}
      {showWeChatQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="relative bg-background rounded-2xl shadow-2xl border border-border p-6 max-w-xs w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWeChatQR(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 relative mb-4 rounded-xl overflow-hidden border border-border">
                <Image
                  src="/images/wechat-qr.png"
                  alt="WeChat QR Code"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <FaWeixin className="w-6 h-6 text-[#07C160]" />
                <span className="text-foreground font-semibold text-lg">WeChat</span>
              </div>
              <p className="text-muted-foreground text-xs">{t("wechatScan")}</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
