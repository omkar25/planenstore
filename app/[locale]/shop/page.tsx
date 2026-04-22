import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ShopPage() {
  const t = useTranslations("Shop");

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <span className="text-4xl">🛍️</span>
      </div>
      <h1 className="mb-3 text-4xl font-bold text-foreground">
        {t("title")}
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        {t("description")}
      </p>
      <Link
        href="/"
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
