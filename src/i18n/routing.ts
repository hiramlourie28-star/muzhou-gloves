import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en", "es", "pt", "ru", "ja", "ko"],
  defaultLocale: "zh",
  localePrefix: "always",
});

export const localeNames: Record<string, string> = {
  zh: "中文",
  en: "English",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
};

export const localeFlags: Record<string, string> = {
  zh: "中",
  en: "EN",
  es: "ES",
  pt: "PT",
  ru: "RU",
  ja: "日",
  ko: "한",
};

export const locales = ["zh", "en", "es", "pt", "ru", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
