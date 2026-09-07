"use client";

import { useState } from "react";
import type { IdentityReview as Review } from "@/lib/engine/feedback";

/** زر «افحص وضوح هويتي» ونتيجته: درجة، مشكلات، اقتراحات. */
export function IdentityReview({ assessmentId, initial, disabled }: { assessmentId: string; initial: Review | null; disabled?: boolean }) {
  const [review, setReview] = useState<Review | null>(initial);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [err, setErr] = useState("");

  async function run() {
    setState("loading");
    const res = await fetch(`/api/identity/${assessmentId}/review`, { method: "POST" });
    const j = await res.json();
    if (res.ok) {
      setReview(j as Review);
      setState("idle");
    } else {
      setErr(j.error || "تعذرت المراجعة");
      setState("error");
    }
  }

  const color = review ? (review.clarity_score >= 70 ? "text-good" : review.clarity_score >= 45 ? "text-warn" : "text-bad") : "";

  return (
    <section className="card no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">هل هويتك واضحة؟</h2>
          <p className="text-sm text-muted">يقرأ Claude ما كتبته ويقارنه ببياناتك وردود الناس، ويعطيك درجة وضوح وتعديلات محددة.</p>
        </div>
        <button className="btn-primary" onClick={run} disabled={disabled || state === "loading"}>{state === "loading" ? "يراجع… نحو دقيقة" : review ? "أعد الفحص" : "افحص وضوح هويتي"}</button>
      </div>
      {disabled ? <p className="mt-2 text-sm text-muted">احفظ وثيقتك أولاً (اكتب سطر التعريف وقيمة واحدة على الأقل).</p> : null}
      {state === "error" ? <p className="mt-2 text-sm text-bad" role="alert">{err}</p> : null}
      {review ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-baseline gap-3">
            <span className={`text-4xl font-bold tabular-nums ${color}`}>{review.clarity_score}</span>
            <span className="text-muted">من 100</span>
            <span className="font-semibold">{review.verdict}</span>
          </div>
          {review.strengths.length ? <p className="text-sm"><span className="font-semibold text-good">الواضح:</span> {review.strengths.join("؛ ")}</p> : null}
          {review.issues.length ? (
            <ul className="space-y-2">
              {review.issues.map((it, i) => (
                <li key={i} className="rounded-lg border border-line px-4 py-2 text-sm">
                  <div className="font-semibold">{it.field}: <span className="font-normal">{it.problem}</span></div>
                  <div className="mt-1 text-accent-deep">اقتراح: {it.suggestion}</div>
                </li>
              ))}
            </ul>
          ) : null}
          {review.contradictions.length ? <p className="text-sm"><span className="font-semibold text-warn">تناقضات مع بياناتك:</span> {review.contradictions.join("؛ ")}</p> : null}
          <p className="readout text-sm"><span className="font-semibold">ابدأ بهذا التعديل:</span> {review.next_edit}</p>
        </div>
      ) : null}
    </section>
  );
}
