import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "../../_components/ProductForm";
import type { Product } from "@/lib/supabase/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await createClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const product = data as Product;

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:underline">
          ← 返回列表
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-1">编辑商品</h1>
      <p className="text-sm text-gray-500 mb-4 font-mono">{product.slug}</p>
      <ProductForm product={product} />
    </div>
  );
}
