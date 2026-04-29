import type { Locale } from "@/i18n/routing";

export type LocalizedText = Partial<Record<Locale, string>>;

export const PRODUCT_CATEGORIES = [
  "ski",
  "leather",
  "fabric",
  "splice",
  "mittens",
  "animals",
  "fingerless",
  "lace",
  "sports",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  name: LocalizedText;
  description: LocalizedText;
  images: string[];
  price_min: number | null;
  price_max: number | null;
  currency: string | null;
  moq: number | null;
  material: string | null;
  size: string | null;
  lead_days_min: number | null;
  lead_days_max: number | null;
  features: string[];
  featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;
