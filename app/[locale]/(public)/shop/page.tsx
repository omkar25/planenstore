import { Metadata } from "next";
import ShopPageClient from "@/components/shop/ShopPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "de"
    ? "Shop - PVC Planen & Gerüstplanen online kaufen | Tori Planen"
    : "Shop - Buy PVC Tarps & Scaffolding Covers Online | Tori Planen";

  const description = locale === "de"
    ? "PVC Planen, Gerüstplanen, Kederplanen & Schutznetze online kaufen. ✓ Hochwertige Qualität ✓ Faire Preise ✓ Schnelle Lieferung ✓ Maßanfertigung möglich"
    : "Buy PVC tarps, scaffolding covers, Keder tarps & safety nets online. ✓ High quality ✓ Fair prices ✓ Fast delivery ✓ Custom sizes available";

  return {
    title,
    description,
    keywords: [
      "PVC Planen kaufen",
      "Gerüstplanen Shop",
      "Kederplanen online",
      "Schutznetze bestellen",
      "Baustellenplanen",
      "Abdeckplanen kaufen",
      "Planen Shop Hamburg",
      "Tori Planen Shop",
    ],
    openGraph: {
      title,
      description,
      url: `https://toriplanen.de/${locale}/shop`,
      type: "website",
    },
    alternates: {
      canonical: `/${locale}/shop`,
      languages: {
        "de-DE": "/de/shop",
        "en-US": "/en/shop",
      },
    },
  };
}

export default function ShopPage() {
  return <ShopPageClient />;
}
