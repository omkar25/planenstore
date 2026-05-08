import { Metadata } from "next";
import About from "@/components/landing-page/About";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "de"
    ? "Über uns - Tori Planen | 20+ Jahre Erfahrung in Planenmontage"
    : "About us - Tori Planen | 20+ Years Experience in Tarp Installation";

  const description = locale === "de"
    ? "TORI BAU GmbH - Ihr Spezialist für Montage von Planen und Netzen seit über 20 Jahren. ✓ Erfahrenes Team ✓ 1000+ Projekte ✓ Deutschlandweite Montage ✓ Höchste Qualität"
    : "TORI BAU GmbH - Your specialist for tarp and net installation for over 20 years. ✓ Experienced team ✓ 1000+ projects ✓ Germany-wide installation ✓ Highest quality";

  return {
    title,
    description,
    keywords: [
      "Tori Planen Über uns",
      "TORI BAU GmbH",
      "Planenmontage Hamburg",
      "Gerüstplanen Spezialist",
      "PVC Planen Erfahrung",
      "Planen Montage Deutschland",
      "Baustellenplanen Experte",
    ],
    openGraph: {
      title,
      description,
      url: `https://toriplanen.de/${locale}/uberuns`,
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/uberuns`,
      languages: {
        "de-DE": "/de/uberuns",
        "en-US": "/en/uberuns",
      },
    },
  };
}

export default function UberUnsPage() {
  return (
    <main className="min-h-screen pt-0">
      <About />
    </main>
  );
}
