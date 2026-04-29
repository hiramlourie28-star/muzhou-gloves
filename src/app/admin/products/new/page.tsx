import Link from "next/link";
import { ProductForm } from "../../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/admin" className="hover:underline">
          ← 返回列表
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">新建商品</h1>
      <ProductForm />
    </div>
  );
}
