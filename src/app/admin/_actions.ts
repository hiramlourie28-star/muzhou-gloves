"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient, isCurrentUserAdmin } from "@/lib/supabase/server";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/supabase/types";
import { locales } from "@/i18n/routing";
import { fillMissingLocales, translateToAll } from "@/lib/aliyun-mt";

async function requireAdmin() {
  const admin = await isCurrentUserAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}

function loginRedirect(next: string, errorMsg?: string): never {
  const params = new URLSearchParams();
  params.set("next", next);
  if (errorMsg) params.set("error", errorMsg);
  redirect(`/admin/login?${params.toString()}`);
}

export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const sb = await createClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    loginRedirect(next, error?.message ?? "登录失败");
  }

  const { data: row } = await sb
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!row) {
    await sb.auth.signOut();
    loginRedirect(next, "该账号不在管理员名单内");
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

function parseLocalized(formData: FormData, prefix: string) {
  const out: Record<string, string> = {};
  for (const loc of locales) {
    const v = String(formData.get(`${prefix}_${loc}`) ?? "").trim();
    if (v) out[loc] = v;
  }
  return out;
}

function parseNumber(v: FormDataEntryValue | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/[\n,，]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const sb = await createClient();

  const id = String(formData.get("id") ?? "").trim() || null;
  const slug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() as ProductCategory;

  if (!slug || !PRODUCT_CATEGORIES.includes(category)) {
    return { error: "slug / 分类必填" };
  }

  const rawName = parseLocalized(formData, "name");
  const rawDesc = parseLocalized(formData, "description");
  const autoTranslate = formData.get("auto_translate") === "true";
  let nameJson: Record<string, string> = rawName;
  let descJson: Record<string, string> = rawDesc;
  try {
    if (autoTranslate) {
      if (rawName.zh) nameJson = await translateToAll(rawName.zh);
      if (rawDesc.zh) descJson = await translateToAll(rawDesc.zh);
    } else {
      if (rawName.zh) nameJson = await fillMissingLocales(rawName, rawName.zh);
      if (rawDesc.zh) descJson = await fillMissingLocales(rawDesc, rawDesc.zh);
    }
  } catch (e) {
    return { error: "翻译失败：" + (e as Error).message };
  }

  const payload = {
    slug,
    category,
    name: nameJson,
    description: descJson,
    images: parseList(formData.get("images")),
    price_min: parseNumber(formData.get("price_min")),
    price_max: parseNumber(formData.get("price_max")),
    currency: String(formData.get("currency") ?? "USD") || "USD",
    moq: parseNumber(formData.get("moq")),
    material: String(formData.get("material") ?? "").trim() || null,
    size: String(formData.get("size") ?? "").trim() || null,
    lead_days_min: parseNumber(formData.get("lead_days_min")),
    lead_days_max: parseNumber(formData.get("lead_days_max")),
    features: parseList(formData.get("features")),
    featured: formData.get("featured") === "on",
    is_active: formData.get("is_active") === "on",
    sort_order: parseNumber(formData.get("sort_order")) ?? 0,
  };

  const { error } = id
    ? await sb.from("products").update(payload).eq("id", id)
    : await sb.from("products").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await sb.from("products").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

export async function toggleActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = await createClient();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  await sb.from("products").update({ is_active: next }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

export async function addAdmin(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) return { error: "请输入有效邮箱" };
  if (password.length < 8) return { error: "密码至少 8 位" };

  const svc = createServiceClient();

  const { data: created, error: createErr } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    return { error: "创建账号失败：" + (createErr?.message ?? "未知错误") };
  }

  const { error: insertErr } = await svc
    .from("admins")
    .insert({ id: created.user.id, email });
  if (insertErr) {
    await svc.auth.admin.deleteUser(created.user.id);
    return { error: "写入 admins 表失败：" + insertErr.message };
  }

  revalidatePath("/admin/team");
  return { success: true, email };
}

export async function removeAdmin(formData: FormData): Promise<void> {
  const me = await requireAdmin();
  const targetId = String(formData.get("id") ?? "");
  if (!targetId) return;
  if (targetId === me.id) return;

  const svc = createServiceClient();
  await svc.from("admins").delete().eq("id", targetId);
  await svc.auth.admin.deleteUser(targetId);
  revalidatePath("/admin/team");
}

export async function uploadImage(formData: FormData) {
  await requireAdmin();
  const sb = await createClient();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "请选择图片" };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await sb.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data } = sb.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
