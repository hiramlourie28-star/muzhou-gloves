"use client";

import { deleteProduct } from "../_actions";

export function DeleteButton({ id, slug }: { id: string; slug: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`确认删除 ${slug}？`)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-red-600 hover:underline">删除</button>
    </form>
  );
}
