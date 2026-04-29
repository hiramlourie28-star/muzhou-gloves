import { getTranslations, getLocale } from "next-intl/server";
import { getActiveProducts, localizedName } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const featured = await getActiveProducts({ featuredOnly: true });

  if (featured.length === 0) return null;

  const items = featured.map((p) => ({
    slug: p.slug,
    image: p.images?.[0] ?? "",
    categoryLabel: t(`categories.${p.category}`),
    name: localizedName(p, locale, t(`${p.category}.name`)),
  }));

  return (
    <FeaturedProductsClient
      locale={locale}
      title={t("featured.title")}
      subtitle={t("featured.subtitle")}
      viewDetailLabel={t("featured.viewDetail")}
      items={items}
    />
  );
}
