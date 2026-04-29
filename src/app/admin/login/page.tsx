import { signIn } from "../_actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-1">管理后台登录</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          牧洲手套 · cnglove.net
        </p>
        <form action={signIn} className="space-y-4">
          <input type="hidden" name="next" value={sp.next ?? "/admin"} />
          <div>
            <label className="text-sm text-gray-700 mb-1 block">邮箱</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">密码</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {sp.error && <p className="text-sm text-red-600">{sp.error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
