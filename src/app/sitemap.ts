import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getActiveProducts } from "@/lib/products";
import { absoluteUrl, localizedPath, languageAlternates } from "@/lib/seo";

const STATIC_PATHS = ["/", "/products", "/about", "/contact", "/inquiry"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const altLanguages = languageAlternates(path);
    for (const loc of locales) {
      entries.push({
        url: absoluteUrl(localizedPath(loc, path)),
        lastModified: now,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1.0 : path === "/products" ? 0.9 : 0.6,
        alternates: { languages: altLanguages },
      });
    }
  }

  for (const p of products) {
    const path = `/products/${p.slug}`;
    const altLanguages = languageAlternates(path);
    const last = p.updated_at ? new Date(p.updated_at) : now;
    for (const loc of locales) {
      entries.push({
        url: absoluteUrl(localizedPath(loc, path)),
        lastModified: last,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: altLanguages },
      });
    }
  }

  return entries;
}
