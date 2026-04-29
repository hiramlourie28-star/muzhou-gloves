import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import AboutContent from "./AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("about.title"),
    description: t("about.subtitle"),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, "/about")),
      languages: languageAlternates("/about"),
    },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
