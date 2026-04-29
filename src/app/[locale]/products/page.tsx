import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getActiveProducts,
  localizedName,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import ProductCard from "./ProductCard";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("products.title"),
    description: t("products.subtitle"),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, "/products")),
      languages: languageAlternates("/products"),
    },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations();

  const selected = (sp.category && PRODUCT_CATEGORIES.includes(sp.category as ProductCategory))
    ? (sp.category as ProductCategory)
    : "all";

  const list = await getActiveProducts({
    category: selected as ProductCategory | "all",
  });

  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-alpine-400 mb-4">
          {t("products.subtitle")}
        </p>
        <h1 className="text-3xl md:text-5xl font-serif text-mountain-800">
          {t("products.title")}
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-16">
        <Link
          href={`/${locale}/products`}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            selected === "all"
              ? "bg-mountain-800 text-white"
              : "text-alpine-500 hover:text-mountain-800 hover:bg-glacier-200"
          }`}
        >
          {t("products.all")}
        </Link>
        {PRODUCT_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/${locale}/products?category=${cat}`}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              selected === cat
                ? "bg-mountain-800 text-white"
                : "text-alpine-500 hover:text-mountain-800 hover:bg-glacier-200"
            }`}
          >
            {t(`categories.${cat}`)}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-alpine-400 text-sm py-20">
          {t("products.noProducts")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p, i) => (
            <ProductCard
              key={p.slug}
              index={i}
              locale={locale}
              slug={p.slug}
              image={p.images?.[0] ?? ""}
              categoryLabel={t(`categories.${p.category}`)}
              name={localizedName(p, locale, t(`${p.category}.name`))}
              viewDetailLabel={t("featured.viewDetail")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
