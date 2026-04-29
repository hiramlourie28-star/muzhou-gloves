import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { absoluteUrl, localizedPath, languageAlternates, SITE_URL } from "@/lib/seo";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const OG_LOCALE_MAP: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  ru: "ru_RU",
  ja: "ja_JP",
  ko: "ko_KR",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};
  const t = await getTranslations({ locale });
  const title = t("site.title");
  const description = t("site.description");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${t("site.companyName")}` },
    description,
    keywords: [
      "gloves",
      "gloves manufacturer",
      "ski gloves",
      "leather gloves",
      "wholesale gloves",
      "custom gloves",
      "muzhou gloves",
    ],
    robots: { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(localizedPath(locale as Locale, "/")),
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[locale as Locale],
      url: absoluteUrl(localizedPath(locale as Locale, "/")),
      title,
      description,
      siteName: t("site.companyName"),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
