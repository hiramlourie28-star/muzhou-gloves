import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { StatusButtons, DeleteButton } from "./InquiryActions";

const LOCALE_LABEL: Record<string, string> = {
  zh: "中文", en: "EN", es: "ES", pt: "PT", ru: "RU", ja: "日", ko: "한",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-red-100 text-red-700",
  contacted: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_LABEL: Record<string, string> = {
  new: "未处理",
  contacted: "已联系",
  closed: "已归档",
};

interface InquiryRow {
  id: string;
  source: "inquiry" | "contact";
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  product_slug: string | null;
  locale: string | null;
  extra: Record<string, string>;
  status: string;
  notified_at: string | null;
  created_at: string;
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status && ["new", "contacted", "closed"].includes(sp.status) ? sp.status : "all";

  const sb = createServiceClient();
  let q = sb.from("inquiries").select("*").order("created_at", { ascending: false });
  if (filter !== "all") q = q.eq("status", filter);
  const { data, error } = await q;
  const inquiries = (data ?? []) as InquiryRow[];

  const counts = await Promise.all(
    ["new", "contacted", "closed"].map(async (s) => {
      const { count } = await sb
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", s);
      return [s, count ?? 0] as const;
    })
  );
  const countMap = Object.fromEntries(counts);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">客户询价</h1>
        <p className="text-sm text-gray-500">所有从前台「询价」「联系我们」表单提交的记录</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {([
          ["all", "全部", inquiries.length],
          ["new", `未处理 ${countMap.new ? `(${countMap.new})` : ""}`, countMap.new],
          ["contacted", `已联系 ${countMap.contacted ? `(${countMap.contacted})` : ""}`, countMap.contacted],
          ["closed", `已归档 ${countMap.closed ? `(${countMap.closed})` : ""}`, countMap.closed],
        ] as const).map(([key, label]) => (
          <Link
            key={key}
            href={key === "all" ? "/admin/inquiries" : `/admin/inquiries?status=${key}`}
            className={`px-3 py-1.5 rounded-md ${
              filter === key ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm">{error.message}</p>}

      <div className="space-y-3">
        {inquiries.length === 0 && (
          <div className="bg-white rounded-xl border text-center py-16 text-gray-400">
            暂无{filter === "all" ? "" : STATUS_LABEL[filter]}询价
          </div>
        )}

        {inquiries.map((q) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLE[q.status]}`}>
                  {STATUS_LABEL[q.status]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {q.source === "inquiry" ? "询价" : "联系我们"}
                </span>
                {q.locale && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {LOCALE_LABEL[q.locale] ?? q.locale}
                  </span>
                )}
                <span className="font-medium ml-1">{q.name}</span>
                {q.company && <span className="text-sm text-gray-500">@ {q.company}</span>}
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(q.created_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
              <div>
                <span className="text-gray-500">邮箱：</span>
                <a href={`mailto:${q.email}`} className="text-blue-600 hover:underline">
                  {q.email}
                </a>
              </div>
              {q.phone && (
                <div>
                  <span className="text-gray-500">电话：</span>
                  <a href={`tel:${q.phone}`} className="text-blue-600 hover:underline">
                    {q.phone}
                  </a>
                </div>
              )}
              {q.product_slug && (
                <div>
                  <span className="text-gray-500">关注产品：</span>
                  <span className="font-mono text-xs">{q.product_slug}</span>
                </div>
              )}
              {q.extra?.productType && (
                <div>
                  <span className="text-gray-500">意向品类：</span>
                  {q.extra.productType}
                </div>
              )}
              {q.extra?.quantity && (
                <div>
                  <span className="text-gray-500">数量：</span>
                  {q.extra.quantity}
                </div>
              )}
              {q.extra?.size && (
                <div>
                  <span className="text-gray-500">尺寸：</span>
                  {q.extra.size}
                </div>
              )}
              {q.extra?.material && (
                <div>
                  <span className="text-gray-500">材质：</span>
                  {q.extra.material}
                </div>
              )}
              {q.extra?.custom && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">定制需求：</span>
                  <span className="whitespace-pre-wrap">{q.extra.custom}</span>
                </div>
              )}
            </div>

            {q.message && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap text-gray-700 mb-3">
                {q.message}
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-2 border-t">
              <StatusButtons id={q.id} current={q.status} />
              <DeleteButton id={q.id} name={q.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
