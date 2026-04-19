import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇬🇧" },
  de: { name: "Deutsch", flag: "🇩🇪" }
  /* hi: { name: "हिन्दी", flag: "🇮🇳" }, */
};
