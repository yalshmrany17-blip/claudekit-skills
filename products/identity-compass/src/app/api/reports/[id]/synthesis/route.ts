import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { hasFullAccess } from "@/lib/access";
import { SYNTHESIS_SYSTEM, buildSynthesisPrompt } from "@/lib/engine/synthesis";
import { SynthesisSchema } from "@/lib/engine/synthesis-schema";
import type { Answers, Result } from "@/lib/engine/types";
import { adminClient } from "@/lib/supabase/admin";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * التوليف العميق: يقرأ النتائج والإجابات المفتوحة ويعيد تقريراً منظماً (JSON) يُحفظ في reports.synthesis.
 * Claude بمخرجات منظمة وتفكير تكيفي، مع بديل خادمي تلقائي عند الرفض.
 */
export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!supabaseConfigured()) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "غير مسجل" }, { status: 401 });

  const { data: a } = await supabase.from("assessments").select("id, answers, result").eq("id", id).single();
  if (!a) return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  if (!(await hasFullAccess(id))) return NextResponse.json({ error: "التقرير الكامل غير مفتوح" }, { status: 402 });

  const { data: existing } = await supabase.from("reports").select("synthesis").eq("assessment_id", id).maybeSingle();
  if (existing?.synthesis) return NextResponse.json(existing.synthesis);

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "لم يُضبط مفتاح Claude على الخادم" }, { status: 503 });

  const client = new Anthropic();
  const model = process.env.CLAUDE_MODEL || "claude-opus-5";
  const prompt = buildSynthesisPrompt(a.result as Result, a.answers as Answers);

  try {
    const response = await client.beta.messages.parse({
      model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYNTHESIS_SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: "high", format: zodOutputFormat(SynthesisSchema) },
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return NextResponse.json({ error: "تعذر توليد التقرير لهذا الطلب. حاول مرة أخرى لاحقاً." }, { status: 502 });
    }

    const synthesis = response.parsed_output;
    await adminClient().from("reports").upsert({ assessment_id: id, synthesis, model: response.model }, { onConflict: "assessment_id" });
    return NextResponse.json(synthesis);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "الخدمة مشغولة الآن، حاول بعد دقيقة." }, { status: 429 });
    if (err instanceof Anthropic.APIError) return NextResponse.json({ error: `تعذر الاتصال بـ Claude (${err.status})` }, { status: 502 });
    console.error("synthesis", err);
    return NextResponse.json({ error: "تعذر التوليد" }, { status: 500 });
  }
}
