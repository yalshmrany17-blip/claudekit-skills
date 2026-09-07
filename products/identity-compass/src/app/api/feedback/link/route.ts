import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasFullAccess } from "@/lib/access";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const Body = z.object({ assessment_id: z.string().uuid() });

/** ينشئ (أو يعيد) رابط التغذية الراجعة لتقييم يملكه المستخدم. */
export async function POST(request: Request) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  const assessmentId = parsed.data.assessment_id;

  const { data: a } = await supabase.from("assessments").select("id").eq("id", assessmentId).single();
  if (!a) return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  if (!(await hasFullAccess(assessmentId))) return NextResponse.json({ error: "هذه الميزة ضمن التقرير الكامل" }, { status: 402 });

  const { data: existing } = await supabase.from("feedback_links").select("token").eq("assessment_id", assessmentId).maybeSingle();
  if (existing?.token) return NextResponse.json({ token: existing.token });

  const token = randomBytes(9).toString("base64url");
  const { error } = await supabase.from("feedback_links").insert({ token, assessment_id: assessmentId, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ token });
}
