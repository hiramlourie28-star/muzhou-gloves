import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import ContactContent from "./ContactContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("contact.title"),
    description: t("contact.subtitle"),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, "/contact")),
      languages: languageAlternates("/contact"),
    },
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
