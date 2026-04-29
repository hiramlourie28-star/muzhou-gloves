"use server";

import { createClient as createSb } from "@supabase/supabase-js";
import { sendInquiryEmail, sendInquirySMS, type InquiryPayload } from "@/lib/notify";

function adminClient() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  const source = formData.get("source") === "contact" ? "contact" : "inquiry";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const company = String(formData.get("company") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim() || null;
  const productSlug = String(formData.get("referredProduct") ?? formData.get("product") ?? "").trim() || null;
  const locale = String(formData.get("locale") ?? "").trim() || null;

  if (!name || !email || !email.includes("@")) {
    return { ok: false, error: "请填写姓名和有效邮箱" };
  }

  const extra: Record<string, string> = {};
  for (const k of ["productType", "quantity", "size", "material", "custom"]) {
    const v = String(formData.get(k) ?? "").trim();
    if (v) extra[k] = v;
  }

  const sb = adminClient();
  const { data: row, error: insertErr } = await sb
    .from("inquiries")
    .insert({
      source,
      name,
      email,
      phone,
      company,
      message,
      product_slug: productSlug,
      locale,
      extra,
    })
    .select("id, created_at")
    .single();

  if (insertErr) return { ok: false, error: "提交失败：" + insertErr.message };

  const payload: InquiryPayload = {
    source,
    name,
    email,
    phone: phone ?? undefined,
    company: company ?? undefined,
    message: message ?? undefined,
    productSlug: productSlug ?? undefined,
    locale: locale ?? undefined,
    extra,
    createdAt: row.created_at,
  };

  const [emailRes, smsRes] = await Promise.all([
    sendInquiryEmail(payload),
    sendInquirySMS(payload),
  ]);

  if (emailRes.ok || smsRes.ok) {
    await sb
      .from("inquiries")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", row.id);
  }

  if (!emailRes.ok && smsRes.skipped) {
    console.error("[inquiry] notify failed:", emailRes.error);
  }

  return { ok: true };
}
