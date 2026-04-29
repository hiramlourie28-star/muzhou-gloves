import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import InquiryContent from "./InquiryContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("inquiry.title"),
    description: t("inquiry.subtitle"),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, "/inquiry")),
      languages: languageAlternates("/inquiry"),
    },
  };
}

export default function InquiryPage() {
  return <InquiryContent />;
}
