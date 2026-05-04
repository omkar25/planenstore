import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/shared/common/header/header";
import Footer from "@/components/shared/common/footer/Footer";
import { ThemeProvider } from "@/components/shared/common/theme/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/shared/seo/JsonLd";
import "../globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "PVC Planen & Gerüstplanen kaufen | Tori Planen Hamburg",
    template: "%s | Tori Planen - PVC Planen Spezialist",
  },
  description:
    "PVC Planen, Gerüstplanen, Kederplanen & Schutznetze vom Spezialisten ✓ Über 20 Jahre Erfahrung ✓ Montage deutschlandweit ✓ Maßanfertigung ✓ Jetzt anfragen!",
  keywords: [
    "PVC Planen",
    "PVC Planen kaufen",
    "Gerüstplanen",
    "Gerüstplanen Montage",
    "Kederplanen",
    "Tori Planen",
    "Planen Hamburg",
    "Abdeckplanen",
    "Schutzplanen",
    "Staubschutznetze",
    "Strahlschutznetze",
    "Personenauffangnetze",
    "Baustellenplanen",
    "Planen Montage Deutschland",
    "Gerüstverkleidung",
    "Wetterschutzplanen",
  ],
  authors: [{ name: "Tori Planen" }],
  creator: "Tori Planen",
  publisher: "Tori Planen",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://toriplanen.de",
    siteName: "Tori Planen",
    title: "Tori Planen - Hochwertige Planen & Abdeckungen",
    description:
      "Ihr zuverlässiger Partner für hochwertige Gerüstplanen, PVC-Planen und maßgeschneiderte Planenlösungen.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tori Planen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tori Planen - Hochwertige Planen & Abdeckungen",
    description:
      "Ihr zuverlässiger Partner für hochwertige Gerüstplanen, PVC-Planen und maßgeschneiderte Planenlösungen.",
    images: ["/images/og-image.jpg"],
  },
  metadataBase: new URL("https://toriplanen.de"),
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/de",
      "en-US": "/en",
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={nunitoSans.variable} suppressHydrationWarning>
      <head>
        {/* ✅ Step 1: CookieYes loads FIRST — blocks everything until consent */}
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/1c86faf07d5d5edf7af1bd6c/script.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LocalBusinessJsonLd locale={locale} />
        <WebsiteJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Header />
            <div className="pt-14">
              {children}
            </div>
            <Footer />
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
