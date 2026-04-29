import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
  localizedName,
  localizedDescription,
} from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";
import ProductGallery from "./ProductGallery";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const t = await getTranslations({ locale });
  const name = localizedName(product, locale, t(`${product.category}.name`));
  const desc = localizedDescription(product, locale, t(`${product.category}.desc`));
  const path = `/products/${slug}`;
  return {
    title: name,
    description: desc.slice(0, 160),
    alternates: {
      canonical: absoluteUrl(localizedPath(locale, path)),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: name,
      description: desc.slice(0, 160),
      url: absoluteUrl(localizedPath(locale, path)),
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations();
  const name = localizedName(product, locale, t(`${product.category}.name`));
  const desc = localizedDescription(product, locale, t(`${product.category}.desc`));
  const related = await getRelatedProducts(product.category, product.slug, 3);

  const priceText = product.price_min != null
    ? `${product.currency ?? "USD"} ${product.price_min}${product.price_max ? `–${product.price_max}` : ""}`
    : null;
  const moqText = product.moq != null ? String(product.moq) : "—";
  const min = product.lead_days_min;
  const max = product.lead_days_max;
  const leadText =
    min != null && max != null
      ? t("products.specs.daysRange", { min, max })
      : min != null
        ? t("products.specs.daysFrom", { n: min })
        : max != null
          ? t("products.specs.daysUpTo", { n: max })
          : "—";

  const specs = [
    { label: t("products.specs.material"), value: product.material || "—" },
    { label: t("products.specs.size"), value: product.size || "—" },
    { label: t("products.specs.moq"), value: moqText },
    { label: t("products.specs.delivery"), value: leadText },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: desc,
    image: product.images?.length ? product.images : undefined,
    sku: product.slug,
    category: t(`categories.${product.category}`),
    ...(product.material ? { material: product.material } : {}),
    brand: { "@type": "Brand", name: t("site.companyName") },
    ...(product.price_min != null
      ? {
          offers: {
            "@type": "Offer",
            url: absoluteUrl(localizedPath(locale, `/products/${product.slug}`)),
            priceCurrency: product.currency ?? "USD",
            price: product.price_min,
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }
      : {}),
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductGallery images={product.images ?? []} alt={name} />

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.2em] text-alpine-400 mb-4">
            {t(`categories.${product.category}`)}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif text-mountain-800 mb-4">
            {name}
          </h1>
          {priceText && (
            <p className="text-2xl text-peak-gold font-serif mb-6">{priceText}</p>
          )}
          <p className="text-alpine-500 text-sm leading-relaxed mb-10 max-w-md">
            {desc}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-alpine-400 mb-3">
                {t("products.specs.features")}
              </p>
              <ul className="space-y-1.5">
                {product.features.map((f, i) => (
                  <li key={i} className="text-sm text-mountain-800 flex items-start">
                    <span className="text-peak-gold mr-2">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-glacier-200 py-6 mb-10">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between py-2 text-sm border-b border-glacier-200/50"
              >
                <span className="text-alpine-400">{spec.label}</span>
                <span className="text-mountain-800 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/inquiry?product=${product.slug}`}
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium bg-mountain-800 text-white hover:bg-mountain-700 transition-colors self-start"
          >
            {t("products.inquiryCta")}
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-serif text-mountain-800 mb-8">
            {t("products.related")}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/products/${p.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-glacier-200 mb-3">
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={localizedName(p, locale, t(`${p.category}.name`))}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  )}
                </div>
                <p className="text-xs text-alpine-500">
                  {t(`categories.${p.category}`)}
                </p>
                <p className="text-sm text-mountain-800">
                  {localizedName(p, locale, t(`${p.category}.name`))}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
