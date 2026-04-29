import "server-only";

const RESEND_API = "https://api.resend.com/emails";

export interface InquiryPayload {
  source: "inquiry" | "contact";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  productSlug?: string;
  locale?: string;
  extra?: Record<string, string | undefined>;
  createdAt: string;
}

const LOCALE_LABEL: Record<string, string> = {
  zh: "中文", en: "English", es: "Español", pt: "Português",
  ru: "Русский", ja: "日本語", ko: "한국어",
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function buildEmailHtml(p: InquiryPayload): string {
  const rows: [string, string | undefined][] = [
    ["类型", p.source === "inquiry" ? "📋 询价" : "✉️ 联系我们"],
    ["客户姓名", p.name],
    ["邮箱", p.email],
    ["电话", p.phone],
    ["公司", p.company],
    ["语言版本", p.locale ? LOCALE_LABEL[p.locale] ?? p.locale : undefined],
    ["询价产品", p.productSlug],
    ["意向产品类型", p.extra?.productType],
    ["数量", p.extra?.quantity],
    ["尺寸要求", p.extra?.size],
    ["材质偏好", p.extra?.material],
    ["定制需求", p.extra?.custom],
    ["留言", p.message],
    ["提交时间", new Date(p.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })],
  ];

  const tr = rows
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:8px 12px;color:#666;border-bottom:1px solid #eee;width:130px;font-size:13px;">${escapeHtml(k)}</td>
          <td style="padding:8px 12px;color:#222;border-bottom:1px solid #eee;font-size:14px;white-space:pre-wrap;">${escapeHtml(v!)}</td>
        </tr>`
    )
    .join("");

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cnglove.net"}/admin/inquiries`;
  return `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#f5f5f5;padding:20px;margin:0;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
  <div style="background:#1a3a52;color:#fff;padding:18px 24px;">
    <h2 style="margin:0;font-size:18px;font-weight:600;">🧤 牧洲手套 · 新询价提醒</h2>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    ${tr}
  </table>
  <div style="padding:18px 24px;background:#fafafa;border-top:1px solid #eee;">
    <a href="${adminUrl}" style="display:inline-block;background:#1a3a52;color:#fff;text-decoration:none;padding:9px 18px;border-radius:6px;font-size:13px;">进入后台查看</a>
    <p style="margin:10px 0 0;color:#888;font-size:12px;">此邮件由 cnglove.net 自动发送 · 请尽快回复客户</p>
  </div>
</div></body></html>`;
}

export async function sendInquiryEmail(p: InquiryPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return { ok: false, error: "邮件未配置" };

  const subject = p.source === "inquiry"
    ? `【询价】${p.name} - ${p.email}`
    : `【联系】${p.name} - ${p.email}`;

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "牧洲手套 <noreply@cnglove.net>",
        to: [to],
        reply_to: p.email,
        subject,
        html: buildEmailHtml(p),
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** 阿里云短信 — 等签名/模板审过再启用 */
export async function sendInquirySMS(p: InquiryPayload): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const phone = process.env.INQUIRY_NOTIFY_PHONE;
  const sign = process.env.ALIYUN_SMS_SIGN_NAME;
  const tpl = process.env.ALIYUN_SMS_TEMPLATE_CODE;
  if (!phone || !sign || !tpl) return { ok: true, skipped: true };

  // 签名/模板审过后这里才会真正调用
  try {
    const { default: Dysmsapi, SendSmsRequest } = await import("@alicloud/dysmsapi20170525");
    const { Config } = await import("@alicloud/openapi-client");
    const { RuntimeOptions } = await import("@alicloud/tea-util");
    const SmsCtor = (Dysmsapi as unknown as { default?: unknown }).default ?? Dysmsapi;
    const ConfigCtor = Config;
    const RuntimeCtor = RuntimeOptions;
    const ReqCtor = SendSmsRequest;
    type SmsCtorType = new (c: unknown) => {
      sendSmsWithOptions: (req: unknown, runtime: unknown) => Promise<{
        body?: { code?: string; message?: string };
      }>;
    };
    const client = new (SmsCtor as unknown as SmsCtorType)(
      new (ConfigCtor as unknown as new (o: unknown) => unknown)({
        accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
        endpoint: "dysmsapi.aliyuncs.com",
      })
    );
    const params = {
      name: (p.name || "客户").slice(0, 20),
      country: p.locale ? LOCALE_LABEL[p.locale] ?? p.locale : "海外",
    };
    const req = new (ReqCtor as unknown as new (o: unknown) => unknown)({
      phoneNumbers: phone,
      signName: sign,
      templateCode: tpl,
      templateParam: JSON.stringify(params),
    });
    const runtime = new (RuntimeCtor as unknown as new (o: unknown) => unknown)({
      readTimeout: 10000,
      connectTimeout: 5000,
    });
    const res = await client.sendSmsWithOptions(req, runtime);
    if (res.body?.code !== "OK") {
      return { ok: false, error: `阿里云短信: ${res.body?.message ?? "unknown"}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
