import { createClient } from "@/lib/supabase/server";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

export { PRODUCT_CATEGORIES, type ProductCategory };

export async function getActiveProducts(opts?: {
  category?: ProductCategory | "all";
  featuredOnly?: boolean;
}): Promise<Product[]> {
  const sb = await createClient();
  let q = sb.from("products").select("*").eq("is_active", true);
  if (opts?.featuredOnly) q = q.eq("featured", true);
  if (opts?.category && opts.category !== "all") q = q.eq("category", opts.category);
  const { data, error } = await q
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[products] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = await createClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function getRelatedProducts(
  category: ProductCategory,
  excludeSlug: string,
  limit = 3
): Promise<Product[]> {
  const sb = await createClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getCategoryCovers(): Promise<
  Record<ProductCategory, string | null>
> {
  const products = await getActiveProducts();
  const out = Object.fromEntries(
    PRODUCT_CATEGORIES.map((c) => [c, null as string | null])
  ) as Record<ProductCategory, string | null>;
  for (const p of products) {
    if (!out[p.category] && p.images?.[0]) out[p.category] = p.images[0];
  }
  return out;
}

export function localizedName(
  p: Product,
  locale: Locale,
  fallback: string
): string {
  return p.name?.[locale] || p.name?.en || fallback;
}

export function localizedDescription(
  p: Product,
  locale: Locale,
  fallback: string
): string {
  return p.description?.[locale] || p.description?.en || fallback;
}
