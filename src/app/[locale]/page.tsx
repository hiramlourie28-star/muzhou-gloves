import HeroSection from "@/components/home/HeroSection";
import BrandValueBar from "@/components/home/BrandValueBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FactoryShowcase from "@/components/home/FactoryShowcase";
import CTABanner from "@/components/ui/CTABanner";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("hero.title"),
    description: t("site.description"),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, "/")),
      languages: languageAlternates("/"),
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandValueBar />
      <CategoryGrid />
      <FeaturedProducts />
      <FactoryShowcase />
      <CTABanner />
    </>
  );
}
