"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function CTABanner() {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <section className="py-24 px-6 bg-mountain-800 text-white text-center">
      <h2 className="text-2xl md:text-4xl font-serif mb-4">
        {t("title")}
      </h2>
      <p className="text-white/70 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
        {t("subtitle")}
      </p>
      <Link
        href={`/${locale}/contact`}
        className="inline-flex items-center px-8 py-3 text-sm font-medium bg-white text-mountain-800 hover:bg-glacier-200 transition-colors"
      >
        {t("button")}
      </Link>
    </section>
  );
}
