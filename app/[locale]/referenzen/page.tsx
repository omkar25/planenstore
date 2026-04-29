import { getTranslations } from "next-intl/server";
import Referenzen from "@/components/landing-page/Referenzen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Referenzen" });
  return {
    title: t("sectionTitle") + " " + t("sectionTitleHighlight"),
    description: t("subtitle"),
  };
}

export default function ReferenzenPage() {
  return (
    <main className="min-h-screen bg-background pt-10">
      <Referenzen />
    </main>
  );
}
