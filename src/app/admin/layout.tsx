import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "./_actions";
import { isCurrentUserAdmin, createServiceClient } from "@/lib/supabase/server";
import "@/app/globals.css";

export const metadata = {
  title: "管理后台 - 牧洲手套",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await isCurrentUserAdmin();
  let newCount = 0;
  if (admin) {
    const sb = createServiceClient();
    const { count } = await sb
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    newCount = count ?? 0;
  }

  return (
    <html lang="zh">
      <body className="min-h-screen bg-gray-50 antialiased">
        {admin ? (
          <div className="flex min-h-screen flex-col">
            <header className="bg-white border-b shadow-sm">
              <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">🧤</span>
                  <span>牧洲手套 · 管理后台</span>
                </Link>
                <div className="flex items-center gap-5 text-sm text-gray-600">
                  <Link href="/admin" className="hover:text-blue-600">商品</Link>
                  <Link href="/admin/inquiries" className="hover:text-blue-600 relative">
                    询价
                    {newCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-600 text-white">
                        {newCount > 99 ? "99+" : newCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/admin/team" className="hover:text-blue-600">管理员</Link>
                  <span className="text-gray-400">|</span>
                  <span>{admin.email}</span>
                  <form action={signOut}>
                    <button className="text-red-600 hover:underline">退出</button>
                  </form>
                </div>
              </div>
            </header>
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
          </div>
        ) : (
          <main className="min-h-screen flex items-center justify-center px-4">{children}</main>
        )}
      </body>
    </html>
  );
}
