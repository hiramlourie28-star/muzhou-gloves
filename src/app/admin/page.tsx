import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleActive } from "./_actions";
import { DeleteButton } from "./_components/DeleteButton";
import type { Product } from "@/lib/supabase/types";

export default async function AdminHome() {
  const sb = await createClient();
  const { data: products, error } = await sb
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">商品管理</h1>
          <p className="text-sm text-gray-500">共 {products?.length ?? 0} 个商品</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          + 新建商品
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error.message}</p>}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-3 py-2 w-16">封面</th>
              <th className="px-3 py-2">slug / 名称</th>
              <th className="px-3 py-2">分类</th>
              <th className="px-3 py-2">价格</th>
              <th className="px-3 py-2 w-20">排序</th>
              <th className="px-3 py-2 w-20">精选</th>
              <th className="px-3 py-2 w-20">上架</th>
              <th className="px-3 py-2 w-32 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p: Product) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.slug}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded" />
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="font-mono text-xs text-gray-500">{p.slug}</div>
                  <div>{p.name?.zh || p.name?.en || "—"}</div>
                </td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {p.price_min != null
                    ? `${p.currency ?? "USD"} ${p.price_min}${
                        p.price_max ? `–${p.price_max}` : ""
                      }`
                    : "—"}
                </td>
                <td className="px-3 py-2">{p.sort_order}</td>
                <td className="px-3 py-2">{p.featured ? "⭐" : ""}</td>
                <td className="px-3 py-2">
                  <form action={toggleActive}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={p.is_active ? "false" : "true"}
                    />
                    <button
                      className={
                        p.is_active
                          ? "text-green-700 hover:underline"
                          : "text-gray-400 hover:underline"
                      }
                    >
                      {p.is_active ? "在售" : "下架"}
                    </button>
                  </form>
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    编辑
                  </Link>
                  <DeleteButton id={p.id} slug={p.slug} />
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-12">
                  暂无商品，点右上角「+ 新建商品」添加
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
