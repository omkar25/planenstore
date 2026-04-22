import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// ── Types ────────────────────────────────────────────────────────────────────

type SectionBase = { number: string; title: string; type: string };

type ContactSection = SectionBase & {
  type: "contact";
  intro: string;
  company: string;
  address: string;
  email: string;
};

type TextSection = SectionBase & {
  type: "text";
  body: string;
  provider?: string;
  date?: string;
};

type TextWithLegalSection = SectionBase & {
  type: "text_with_legal";
  body: string;
  legal_basis: string;
};

type TextWithLegalAndLinkSection = SectionBase & {
  type: "text_with_legal_and_link";
  body: string;
  legal_basis: string;
  link_label: string;
  link_url: string;
};

type ListSection = SectionBase & {
  type: "list";
  intro: string;
  items: string[];
  legal_basis: string;
};

type ServicesSection = SectionBase & {
  type: "services";
  services: { name: string; desc: string }[];
  note: string;
};

type RightsSection = SectionBase & {
  type: "rights";
  intro: string;
  rights: { right: string; article: string }[];
};

type AuthoritySection = SectionBase & {
  type: "authority";
  intro: string;
  authority_name: string;
  authority_address: string;
  authority_url: string;
};

type Section =
  | ContactSection
  | TextSection
  | TextWithLegalSection
  | TextWithLegalAndLinkSection
  | ListSection
  | ServicesSection
  | RightsSection
  | AuthoritySection;

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "datenschutz" });
  return { title: t("title") };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LegalBadge({ label, text }: { label: string; text: string }) {
  return (
    <p className="text-muted-foreground text-sm bg-muted rounded-md px-4 py-3 border-l-2 border-primary">
      <span className="font-semibold text-foreground">{label}:</span> {text}
    </p>
  );
}

function SectionContent({
  section,
  legalLabel,
}: {
  section: Section;
  legalLabel: string;
}) {
  switch (section.type) {
    case "contact": {
      const s = section as ContactSection;
      return (
        <p className="text-muted-foreground leading-relaxed">
          {s.intro}
          <br />
          <br />
          <span className="font-semibold text-foreground">{s.company}</span>
          <br />
          {s.address.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          E-Mail:{" "}
          <a
            href={`mailto:${s.email}`}
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            {s.email}
          </a>
        </p>
      );
    }

    case "text": {
      const s = section as TextSection;
      const body = s.body
        .replace("{provider}", s.provider ?? "")
        .replace("{date}", s.date ? `<strong>${s.date}</strong>` : "");
      return (
        <p
          className="text-muted-foreground leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      );
    }

    case "text_with_legal": {
      const s = section as TextWithLegalSection;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">{s.body}</p>
          <LegalBadge label={legalLabel} text={s.legal_basis} />
        </div>
      );
    }

    case "text_with_legal_and_link": {
      const s = section as TextWithLegalAndLinkSection;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">{s.body}</p>
          <LegalBadge label={legalLabel} text={s.legal_basis} />
          <p className="text-muted-foreground text-sm">
            {s.link_label}:{" "}
            <a
              href={s.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all"
            >
              {s.link_url}
            </a>
          </p>
        </div>
      );
    }

    case "list": {
      const s = section as ListSection;
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{s.intro}</p>
          <ul className="space-y-2">
            {s.items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <LegalBadge label={legalLabel} text={s.legal_basis} />
        </div>
      );
    }

    case "services": {
      const s = section as ServicesSection;
      return (
        <div className="space-y-4">
          {s.services.map((service) => (
            <div
              key={service.name}
              className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border"
            >
              <span className="text-primary text-lg flex-shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  {service.name}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
          <p className="text-muted-foreground text-sm bg-primary/5 rounded-md px-4 py-3 border border-primary/20">
            {s.note}
          </p>
        </div>
      );
    }

    case "rights": {
      const s = section as RightsSection;
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{s.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {s.rights.map((item) => (
              <div
                key={item.right}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {item.right}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {item.article}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "authority": {
      const s = section as AuthoritySection;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">{s.intro}</p>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="font-semibold text-foreground mb-1">
              {s.authority_name}
            </p>
            <p className="text-muted-foreground text-sm mb-2">{s.authority_address}</p>
            <a
              href={s.authority_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors text-sm"
            >
              {s.authority_url}
            </a>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DatenschutzPage() {
  const t = useTranslations("datenschutz");
  const sections = t.raw("sections") as Section[];

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
          <p className="mt-3 text-muted-foreground text-base max-w-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* Table of Contents */}
        <nav className="bg-card rounded-lg border border-border p-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            {t("toc_label")}
          </p>
          <ol className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.number}>
                <a
                  href={`#section-${s.number}`}
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors text-sm py-0.5"
                >
                  <span className="text-xs font-semibold text-primary/70 w-5 text-right">
                    {s.number}.
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.number}
              id={`section-${section.number}`}
              className="scroll-mt-8"
            >
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-baseline gap-2">
                <span className="text-primary text-sm">{section.number}.</span>
                {section.title}
              </h2>
              <SectionContent
                section={section}
                legalLabel={t("legal_basis_label")}
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
