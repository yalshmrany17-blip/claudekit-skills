import { NextResponse } from "next/server";
import { z } from "zod";
import { adminClient } from "@/lib/supabase/admin";
import { supabaseConfigured } from "@/lib/supabase/server";

const Body = z.object({
  relation: z.string().max(40).optional(),
  keep: z.string().min(2).max(1500),
  change: z.string().min(2).max(1500),
  best: z.string().max(2000).optional(),
});

const MAX_RESPONSES = 40;

/** يستقبل رد شخص على رابط التغذية الراجعة، بلا تسجيل دخول. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(token)) return NextResponse.json({ error: "رابط غير صالح" }, { status: 400 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "أكمل الحقلين الأولين على الأقل" }, { status: 400 });

  const admin = adminClient();
  const { data: link } = await admin.from("feedback_links").select("token").eq("token", token).maybeSingle();
  if (!link) return NextResponse.json({ error: "الرابط غير موجود" }, { status: 404 });

  const { count } = await admin.from("feedback_responses").select("id", { count: "exact", head: true }).eq("token", token);
  if ((count ?? 0) >= MAX_RESPONSES) return NextResponse.json({ error: "اكتمل عدد الردود لهذا الرابط" }, { status: 429 });

  const { error } = await admin.from("feedback_responses").insert({
    token,
    relation: parsed.data.relation || null,
    keep: parsed.data.keep.trim(),
    change: parsed.data.change.trim(),
    best: parsed.data.best?.trim() || null,
  });
  if (error) return NextResponse.json({ error: "تعذر الحفظ" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
