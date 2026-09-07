import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { hasFullAccess } from "@/lib/access";
import { NARRATIVE_SYSTEM, buildNarrativePrompt } from "@/lib/engine/narrative";
import type { Answers, Result } from "@/lib/engine/types";
import { adminClient } from "@/lib/supabase/admin";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * يولّد السرد الشخصي للتقرير الكامل ويبثه نصاً، ثم يحفظه في جدول reports.
 * يعتمد على Claude مع تفكير تكيفي وبث؛ وبديل خادمي تلقائي عند الرفض.
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

  const { data: existing } = await supabase.from("reports").select("narrative").eq("assessment_id", id).maybeSingle();
  if (existing?.narrative) {
    return new Response(existing.narrative, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  }

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "لم يُضبط مفتاح Claude على الخادم" }, { status: 503 });

  const client = new Anthropic();
  const model = process.env.CLAUDE_MODEL || "claude-opus-5";
  const prompt = buildNarrativePrompt(a.result as Result, a.answers as Answers);

  const stream = client.beta.messages.stream({
    model,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: NARRATIVE_SYSTEM,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let text = "";
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            text += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nتعذر إكمال السرد لهذا الطلب. حاول مرة أخرى لاحقاً."));
        } else if (text.trim()) {
          await adminClient().from("reports").upsert({ assessment_id: id, narrative: text, model: final.model }, { onConflict: "assessment_id" });
        }
      } catch (err) {
        console.error("narrative", err);
        controller.enqueue(encoder.encode("\n\n[تعذر إكمال التوليد. حاول مرة أخرى]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
