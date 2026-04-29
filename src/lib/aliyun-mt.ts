import "server-only";
import * as AlimtMod from "@alicloud/alimt20181012";
import * as OpenApiMod from "@alicloud/openapi-client";
import * as UtilMod from "@alicloud/tea-util";
import type { Locale } from "@/i18n/routing";

// CJS↔ESM interop: under Node native ESM the class is at `mod.default.default`,
// under Turbopack/webpack CJS-interop it's at `mod.default`. Try both.
function resolveDefault<T>(mod: unknown): T {
  const m = mod as { default?: unknown };
  const d = m.default;
  if (typeof d === "function") return d as T;
  if (d && typeof (d as { default?: unknown }).default === "function")
    return (d as { default: T }).default;
  throw new Error("Cannot resolve SDK default export");
}

// Named exports work consistently across bundlers
function resolveNamed<T>(mod: unknown, name: string): T {
  const m = mod as Record<string, unknown> & { default?: Record<string, unknown> };
  const v = m[name] ?? m.default?.[name];
  if (typeof v !== "function")
    throw new Error(`Cannot resolve named export "${name}"`);
  return v as T;
}

type AlimtCtor = new (config: unknown) => {
  translateGeneralWithOptions: (
    req: unknown,
    runtime: unknown
  ) => Promise<{
    body?: { data?: { translated?: string }; code?: number; message?: string };
  }>;
};

const AlimtClient = resolveDefault<AlimtCtor>(AlimtMod);
const OpenApiConfig = resolveNamed<new (o: unknown) => unknown>(OpenApiMod, "Config");
const RuntimeOptions = resolveNamed<new (o: unknown) => unknown>(UtilMod, "RuntimeOptions");
const TranslateGeneralRequest = resolveNamed<new (o: unknown) => unknown>(
  AlimtMod,
  "TranslateGeneralRequest"
);

let client: InstanceType<AlimtCtor> | null = null;
function getClient(): InstanceType<AlimtCtor> {
  if (client) return client;
  const id = process.env.ALIYUN_ACCESS_KEY_ID;
  const secret = process.env.ALIYUN_ACCESS_KEY_SECRET;
  if (!id || !secret) throw new Error("Aliyun AccessKey not configured");
  const config = new OpenApiConfig({
    accessKeyId: id,
    accessKeySecret: secret,
    endpoint: "mt.cn-hangzhou.aliyuncs.com",
  });
  client = new AlimtClient(config);
  return client;
}

const runtime = new RuntimeOptions({ readTimeout: 15000, connectTimeout: 8000 });

const TARGETS: Locale[] = ["en", "es", "pt", "ru", "ja", "ko"];

async function translateOne(
  text: string,
  target: Locale,
  source: Locale = "zh"
): Promise<string> {
  if (!text.trim()) return "";
  if (target === source) return text;
  const c = getClient();
  const req = new TranslateGeneralRequest({
    formatType: "text",
    sourceLanguage: source,
    targetLanguage: target,
    sourceText: text,
    scene: "general",
  });
  const res = await c.translateGeneralWithOptions(req, runtime);
  const translated = res.body?.data?.translated;
  if (typeof translated !== "string") {
    throw new Error(`阿里云翻译失败: ${res.body?.message ?? "unknown"}`);
  }
  return translated;
}

export async function translateToAll(
  textZh: string
): Promise<Record<Locale, string>> {
  if (!textZh.trim()) {
    return { zh: "", en: "", es: "", pt: "", ru: "", ja: "", ko: "" };
  }
  const out: Record<Locale, string> = {
    zh: textZh,
    en: "",
    es: "",
    pt: "",
    ru: "",
    ja: "",
    ko: "",
  };
  const results = await Promise.all(
    TARGETS.map(async (loc) => [loc, await translateOne(textZh, loc)] as const)
  );
  for (const [loc, translated] of results) out[loc] = translated;
  return out;
}

export async function fillMissingLocales(
  current: Record<string, string | undefined>,
  textZh: string
): Promise<Record<string, string>> {
  const out: Record<string, string> = { ...current, zh: textZh };
  if (!textZh.trim()) return out;
  const missing = TARGETS.filter((loc) => !current[loc]?.trim());
  if (missing.length === 0) return out;
  const results = await Promise.all(
    missing.map(async (loc) => [loc, await translateOne(textZh, loc)] as const)
  );
  for (const [loc, translated] of results) out[loc] = translated;
  return out;
}
