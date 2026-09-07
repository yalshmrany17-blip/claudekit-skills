import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { FEEDBACK_SUMMARY_SYSTEM, buildFeedbackSummaryPrompt, type FeedbackResponse } from "@/lib/engine/feedback";
import { FeedbackSummarySchema } from "@/lib/engine/feedback-schema";
import type { Answers, Result } from "@/lib/engine/types";
import { adminClient } from "@/lib/supabase/admin";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

/** يلخص ردود الناس على رابط يملكه المستخدم (المنطقة العمياء والمفتوحة) ويحفظ الخلاصة. */
export async function POST(_request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!supabaseConfigured()) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });

  const { data: link } = await supabase.from("feedback_links").select("token, assessment_id").eq("token", token).maybeSingle();
  if (!link) return NextResponse.json({ error: "الرابط غير موجود" }, { status: 404 });

  const [{ data: rows }, { data: a }] = await Promise.all([
    supabase.from("feedback_responses").select("relation, keep, change, best, created_at").eq("token", token).order("created_at"),
    supabase.from("assessments").select("answers, result").eq("id", link.assessment_id).single(),
  ]);
  const responses = (rows ?? []) as FeedbackResponse[];
  if (responses.length < 3) return NextResponse.json({ error: "تحتاج ثلاثة ردود على الأقل قبل التلخيص" }, { status: 400 });
  if (!a) return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "لم يُضبط مفتاح Claude على الخادم" }, { status: 503 });

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.parse({
      model: process.env.CLAUDE_MODEL || "claude-opus-5",
      max_tokens: 6000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: FEEDBACK_SUMMARY_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(FeedbackSummarySchema) },
      messages: [{ role: "user", content: buildFeedbackSummaryPrompt(responses, a.answers as Answers, a.result as Result) }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) return NextResponse.json({ error: "تعذر التلخيص لهذا الطلب" }, { status: 502 });
    const summary = response.parsed_output;
    await adminClient().from("feedback_links").update({ summary }).eq("token", token);
    return NextResponse.json(summary);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "الخدمة مشغولة الآن، حاول بعد دقيقة." }, { status: 429 });
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: `تعذر الاتصال بـ Claude (${err.status})` }, { status: 502 });
    console.error("feedback summary", err);
    return NextResponse.json({ error: "تعذر التلخيص" }, { status: 500 });
  }
}
