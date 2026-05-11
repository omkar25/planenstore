import { Metadata } from "next";
import Kontakt from "@/components/landing-page/Kontakt";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "de" 
    ? "Kontakt - Tori Planen Hamburg | Jetzt anfragen"
    : "Contact - Tori Planen Hamburg | Get in touch";
  
  const description = locale === "de"
    ? "Kontaktieren Sie Tori Planen für PVC Planen, Gerüstplanen & Schutznetze. ✓ Kostenlose Beratung ✓ Schnelle Antwort ✓ Montage deutschlandweit. Tel: +49 40 303 72 206"
    : "Contact Tori Planen for PVC tarps, scaffolding covers & safety nets. ✓ Free consultation ✓ Quick response ✓ Installation throughout Germany. Tel: +49 40 303 72 206";

  return {
    title,
    description,
    keywords: [
      "Kontakt Tori Planen",
      "PVC Planen anfragen",
      "Gerüstplanen Angebot",
      "Planen Hamburg Kontakt",
      "Tori Planen Telefon",
      "Planen Montage anfragen",
    ],
    openGraph: {
      title,
      description,
      url: `https://www.toriplanen.de/${locale}/kontakt`,
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/kontakt`,
      languages: {
        "de-DE": "/de/kontakt",
        "en-US": "/en/kontakt",
      },
    },
  };
}

export default function KontaktPage() {
  return (
    <main className="min-h-screen pt-0">
      <Kontakt />
    </main>
  );
}
