import Link from "next/link";
import { createServiceClient, isCurrentUserAdmin } from "@/lib/supabase/server";
import { AddAdminForm } from "./AddAdminForm";
import { RemoveAdminButton } from "./RemoveAdminButton";

export default async function TeamPage() {
  const me = await isCurrentUserAdmin();
  const svc = createServiceClient();
  const { data: admins } = await svc
    .from("admins")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <Link href="/admin" className="hover:underline">
          ← 返回商品管理
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-semibold">管理员账号</h1>
        <p className="text-sm text-gray-500">
          共 {admins?.length ?? 0} 个管理员都能登录 /admin 编辑商品
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-3 py-2">邮箱</th>
              <th className="px-3 py-2 w-24">角色</th>
              <th className="px-3 py-2 w-40">创建时间</th>
              <th className="px-3 py-2 w-24 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {(admins ?? []).map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2">
                  {a.email}
                  {a.id === me?.id && (
                    <span className="ml-2 text-xs text-blue-600">（你）</span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-500">{a.role}</td>
                <td className="px-3 py-2 text-gray-500">
                  {new Date(a.created_at).toLocaleDateString("zh-CN")}
                </td>
                <td className="px-3 py-2 text-right">
                  {a.id !== me?.id && (
                    <RemoveAdminButton id={a.id} email={a.email} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddAdminForm />
    </div>
  );
}
