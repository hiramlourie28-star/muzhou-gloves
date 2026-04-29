import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

void createBrowserClient;

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll inside RSC is allowed to fail; session is refreshed in proxy
          }
        },
      },
    }
  );
}

/** Service-role client — bypasses RLS. ONLY use in server-side admin contexts after `requireAdmin()`. */
export function createServiceClient() {
  return createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function isCurrentUserAdmin() {
  const sb = await createClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return null;
  const { data: row } = await sb
    .from("admins")
    .select("id, email, role")
    .eq("id", auth.user.id)
    .maybeSingle();
  return row;
}
