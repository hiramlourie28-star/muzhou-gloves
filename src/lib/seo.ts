import { locales, type Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
  "https://www.cnglove.net";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/** Build alternates.languages map for hreflang */
export function languageAlternates(path = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of locales) {
    out[loc] = absoluteUrl(localizedPath(loc, path));
  }
  out["x-default"] = absoluteUrl(localizedPath("en", path));
  return out;
}
