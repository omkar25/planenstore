import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemType = "phone" | "email" | "text";

type SectionItem = {
  label: string;
  value: string;
  type?: ItemType;
};

type ImpressumSection = {
  title: string;
  intro?: string;
  items: SectionItem[];
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impressum" });
  return { title: t("title") };
}

// ── Item renderer ─────────────────────────────────────────────────────────────

function ItemValue({ item }: { item: SectionItem }) {
  if (item.type === "email") {
    return (
      <a
        href={`mailto:${item.value}`}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {item.value}
      </a>
    );
  }

  if (item.type === "phone") {
    return (
      <a
        href={`tel:${item.value.replace(/\s/g, "")}`}
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      >
        {item.value}
      </a>
    );
  }

  // Multi-line plain text (e.g. addresses)
  if (item.value.includes("\n")) {
    return (
      <span>
        {item.value.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < item.value.split("\n").length - 1 && <br />}
          </span>
        ))}
      </span>
    );
  }

  return <span>{item.value}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ImpressumPage() {
  const t = useTranslations("impressum");
  const sections = t.raw("sections") as ImpressumSection[];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-muted/40">
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-12">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            {t("badge")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-base">{t("subtitle")}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {section.title}
            </h2>

            {section.intro && (
              <p className="text-muted-foreground text-sm italic mb-3">
                {section.intro}
              </p>
            )}

            <dl className="divide-y divide-border">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-start py-3 gap-1 sm:gap-6"
                >
                  <dt className="text-muted-foreground text-sm font-medium w-full sm:w-44 flex-shrink-0">
                    {item.label}
                  </dt>
                  <dd className="text-foreground text-sm leading-relaxed">
                    <ItemValue item={item} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
