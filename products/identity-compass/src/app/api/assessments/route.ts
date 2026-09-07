import { NextResponse } from "next/server";
import { z } from "zod";
import { score } from "@/lib/engine/scoring";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const Body = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export async function POST(request: Request) {
  if (!supabaseConfigured()) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "إجابات غير صالحة" }, { status: 400 });

  const answers = parsed.data.answers;
  const result = score(answers);
  if (result.completeness < 0.9) return NextResponse.json({ error: "التقييم غير مكتمل" }, { status: 400 });

  const { data, error } = await supabase
    .from("assessments")
    .insert({ user_id: user.id, answers, result, status: "completed" })
    .select("id")
    .single();
  if (error || !data) return NextResponse.json({ error: error?.message || "تعذر الحفظ" }, { status: 500 });

  const name = String(answers.p_name || "").trim();
  if (name) await supabase.from("profiles").upsert({ id: user.id, name });

  return NextResponse.json({ id: data.id });
}
