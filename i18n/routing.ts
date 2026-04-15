import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "hi", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});
