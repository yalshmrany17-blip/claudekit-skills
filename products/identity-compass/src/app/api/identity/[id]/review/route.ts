import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { hasFullAccess } from "@/lib/access";
import { REVIEW_SYSTEM, buildReviewPrompt, type FeedbackSummary } from "@/lib/engine/feedback";
import { IdentityReviewSchema } from "@/lib/engine/feedback-schema";
import type { IdentityDoc } from "@/lib/engine/identity";
import type { Answers, Result } from "@/lib/engine/types";
import { adminClient } from "@/lib/supabase/admin";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

/** مراجعة وضوح وثيقة الهوية: يقرأ Claude ما كتبه العميل ويقارنه ببياناته ويعيد درجة ومشكلات واقتراحات. */
export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!supabaseConfigured()) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });
  if (!(await hasFullAccess(id))) return NextResponse.json({ error: "التقرير الكامل غير مفتوح" }, { status: 402 });

  const [{ data: a }, { data: ident }, { data: link }] = await Promise.all([
    supabase.from("assessments").select("answers, result").eq("id", id).single(),
    supabase.from("identities").select("doc").eq("assessment_id", id).maybeSingle(),
    supabase.from("feedback_links").select("summary").eq("assessment_id", id).maybeSingle(),
  ]);
  if (!a) return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  if (!ident?.doc) return NextResponse.json({ error: "اكتب وثيقتك أولاً" }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "لم يُضبط مفتاح Claude على الخادم" }, { status: 503 });

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.parse({
      model: process.env.CLAUDE_MODEL || "claude-opus-5",
      max_tokens: 6000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: REVIEW_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: "high", format: zodOutputFormat(IdentityReviewSchema) },
      messages: [{ role: "user", content: buildReviewPrompt(ident.doc as IdentityDoc, a.result as Result, a.answers as Answers, (link?.summary as FeedbackSummary | null) ?? null) }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) return NextResponse.json({ error: "تعذرت المراجعة لهذا الطلب" }, { status: 502 });
    const review = response.parsed_output;
    await adminClient().from("identities").update({ review }).eq("assessment_id", id);
    return NextResponse.json(review);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "الخدمة مشغولة الآن، حاول بعد دقيقة." }, { status: 429 });
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: `تعذر الاتصال بـ Claude (${err.status})` }, { status: 502 });
    console.error("identity review", err);
    return NextResponse.json({ error: "تعذرت المراجعة" }, { status: 500 });
  }
}
