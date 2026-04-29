"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveProduct, uploadImage } from "../_actions";
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/supabase/types";
import { locales, localeNames } from "@/i18n/routing";

const blankProduct: Partial<Product> = {
  slug: "",
  category: "ski" as ProductCategory,
  name: {},
  description: {},
  images: [],
  price_min: null,
  price_max: null,
  currency: "USD",
  moq: null,
  material: "",
  size: "",
  lead_days_min: null,
  lead_days_max: null,
  features: [],
  featured: false,
  is_active: true,
  sort_order: 0,
};

export function ProductForm({ product }: { product?: Product }) {
  const data = { ...blankProduct, ...product };
  const [activeTab, setActiveTab] = useState<string>("zh");
  const [advanced, setAdvanced] = useState(false);
  const [images, setImages] = useState<string[]>(data.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (res?.error) setError(res.error);
      else if (res?.url) setImages((prev) => [...prev, res.url!]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onSubmit(formData: FormData) {
    formData.set("images", images.join("\n"));
    startTransition(async () => {
      const res = await saveProduct(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form action={onSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border p-6">
      {data.id && <input type="hidden" name="id" value={data.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="slug（URL 标识，英文小写+连字符）" required>
          <input
            name="slug"
            defaultValue={data.slug ?? ""}
            required
            pattern="[a-z0-9\-]+"
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="分类" required>
          <select
            name="category"
            defaultValue={data.category ?? "ski"}
            className="w-full rounded-lg border px-3 py-2"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* 多语言文案 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">商品文案</h3>
          <button
            type="button"
            onClick={() => setAdvanced(!advanced)}
            className="text-xs text-blue-600 hover:underline"
          >
            {advanced ? "← 收起其他语言" : "高级：手动填其他语言 →"}
          </button>
        </div>

        {!advanced && (
          <div className="space-y-3 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
            <input type="hidden" name="auto_translate" value="true" />
            <Field label="产品名称（中文）">
              <input
                name="name_zh"
                defaultValue={data.name?.zh ?? ""}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="例：防水触屏滑雪手套"
              />
            </Field>
            <Field label="产品描述（中文）">
              <textarea
                name="description_zh"
                defaultValue={data.description?.zh ?? ""}
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="详细描述商品的卖点、材质、适用场景等"
              />
            </Field>
            <p className="text-xs text-gray-600">
              💡 保存时把英/西/葡/俄/日/韩 6 种语言全部按中文重新翻译（覆盖旧版本）
            </p>
          </div>
        )}

        {advanced && (
          <div>
            <div className="flex flex-wrap gap-1 border-b mb-3">
              {locales.map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setActiveTab(l)}
                  className={`px-3 py-1.5 text-sm rounded-t-lg ${
                    activeTab === l
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {localeNames[l]}
                </button>
              ))}
            </div>

            {locales.map((l) => (
              <div key={l} className={activeTab === l ? "" : "hidden"}>
                <div className="space-y-3">
                  <Field label={`产品名称（${localeNames[l]}）`}>
                    <input
                      name={`name_${l}`}
                      defaultValue={data.name?.[l] ?? ""}
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </Field>
                  <Field label={`产品描述（${localeNames[l]}）`}>
                    <textarea
                      name={`description_${l}`}
                      defaultValue={data.description?.[l] ?? ""}
                      rows={4}
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </Field>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">
              留空的语言保存时会用中文自动翻译填充；已有内容不会被覆盖
            </p>
          </div>
        )}
      </div>

      {/* 图片 */}
      <div>
        <label className="text-sm font-medium block mb-2">商品图片</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative w-24 h-24 border rounded-lg overflow-hidden group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-600/80 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100"
                title="删除"
              >
                ×
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:text-blue-500">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
              disabled={uploading}
            />
            {uploading ? "上传中…" : "+ 上传"}
          </label>
        </div>
      </div>

      {/* 价格 + 规格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="货币">
          <input
            name="currency"
            defaultValue={data.currency ?? "USD"}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="价格（最低）">
          <input
            name="price_min"
            type="number"
            step="0.01"
            defaultValue={data.price_min ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="价格（最高，选填）">
          <input
            name="price_max"
            type="number"
            step="0.01"
            defaultValue={data.price_max ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="最小起订量 MOQ">
          <input
            name="moq"
            type="number"
            defaultValue={data.moq ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="材质">
          <input
            name="material"
            defaultValue={data.material ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="尺码">
          <input
            name="size"
            defaultValue={data.size ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="交期（最短，天）">
          <input
            name="lead_days_min"
            type="number"
            defaultValue={data.lead_days_min ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="交期（最长，天）">
          <input
            name="lead_days_max"
            type="number"
            defaultValue={data.lead_days_max ?? ""}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="排序（数字越小越靠前）">
          <input
            name="sort_order"
            type="number"
            defaultValue={data.sort_order ?? 0}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
      </div>

      <Field label="特点（一行一条，或用逗号分隔）">
        <textarea
          name="features"
          defaultValue={(data.features ?? []).join("\n")}
          rows={3}
          className="w-full rounded-lg border px-3 py-2"
        />
      </Field>

      <div className="flex gap-6 items-center">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={data.featured ?? false}
            className="w-4 h-4"
          />
          <span className="text-sm">⭐ 首页精选</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={data.is_active ?? true}
            className="w-4 h-4"
          />
          <span className="text-sm">前台显示（上架）</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2 border-t">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg"
        >
          {pending ? "保存中…" : "保存"}
        </button>
        <Link
          href="/admin"
          className="px-5 py-2 rounded-lg border hover:bg-gray-50 text-gray-700"
        >
          取消
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700 block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
