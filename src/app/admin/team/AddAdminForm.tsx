"use client";

import { useState, useTransition } from "react";
import { addAdmin } from "../_actions";

export function AddAdminForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await addAdmin(formData);
      if (res?.error) setError(res.error);
      if (res?.success) {
        setSuccess(`✅ 已添加 ${res.email}`);
        (document.getElementById("addAdminForm") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <form
      id="addAdminForm"
      action={onSubmit}
      className="bg-white rounded-xl shadow-sm border p-6 space-y-4"
    >
      <h2 className="text-base font-semibold">+ 新增管理员</h2>
      <p className="text-xs text-gray-500">
        让对方坐到你电脑前自己填邮箱和密码，或者你帮他设一个临时密码再让他自己改。
      </p>

      <div>
        <label className="text-sm text-gray-700 block mb-1">邮箱</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="example@cnglove.net"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700 block mb-1">密码（至少 8 位）</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          建议 12 位以上，含大小写+数字
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg"
      >
        {pending ? "创建中…" : "创建管理员"}
      </button>
    </form>
  );
}
