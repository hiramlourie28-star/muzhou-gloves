"use client";

import { removeAdmin } from "../_actions";

export function RemoveAdminButton({ id, email }: { id: string; email: string }) {
  return (
    <form
      action={removeAdmin}
      onSubmit={(e) => {
        if (!confirm(`确认删除管理员 ${email}？\n该账号将无法再登录后台。`))
          e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-red-600 hover:underline text-sm">删除</button>
    </form>
  );
}
