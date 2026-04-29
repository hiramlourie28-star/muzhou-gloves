import { getTranslations, getLocale } from "next-intl/server";
import { getCategoryCovers, PRODUCT_CATEGORIES } from "@/lib/products";
import CategoryGridClient from "./CategoryGridClient";

export default async function CategoryGrid() {
  const locale = await getLocale();
  const t = await getTranslations("categories");
  const covers = await getCategoryCovers();

  const items = PRODUCT_CATEGORIES.map((cat) => ({
    key: cat,
    label: t(cat),
    image: covers[cat],
  }));

  return (
    <CategoryGridClient
      locale={locale}
      title={t("title")}
      subtitle={t("subtitle")}
      items={items}
    />
  );
}
