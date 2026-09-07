import { createClient } from "@supabase/supabase-js";

/** عميل بمفتاح service role: للويبهوك وكتابة التقارير فقط. لا يُستخدم في المتصفح أبداً. */
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY غير مضبوط");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
