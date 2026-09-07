"use client";

import { useState } from "react";
import { FEEDBACK_RELATIONS } from "@/lib/engine/feedback";

/** الصفحة العامة: شخص مقرب يجيب عن ثلاثة أسئلة بلا تسجيل دخول. */
export function FeedbackForm({ token, name }: { token: string; name: string }) {
  const [relation, setRelation] = useState("");
  const [keep, setKeep] = useState("");
  const [change, setChange] = useState("");
  const [best, setBest] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch(`/api/feedback/${token}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ relation, keep, change, best }) });
    if (res.ok) setState("done");
    else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "تعذر الإرسال");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div className="readout">
        <div className="text-lg font-bold">وصل ردك. شكراً لك.</div>
        <p className="mt-1 text-muted">ردك مجهول: {name || "صاحب الرابط"} يرى ما كتبت دون اسمك.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <h1 className="text-xl font-bold">{name ? `${name} يطلب رأيك بصراحة` : "رأيك بصراحة"}</h1>
        <p className="mt-1 text-muted">دقيقتان. ثلاثة أسئلة. ردك يصل مجهولاً ويُستخدم فقط لمساعدته على معرفة نفسه.</p>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-muted">علاقتك به</span>
        <select className="field mt-1" value={relation} onChange={(e) => setRelation(e.target.value)}>
          <option value="">اختر</option>
          {FEEDBACK_RELATIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-muted">صفة أو تصرف تنصحه أن يعززه</span>
        <textarea className="field mt-1 min-h-[80px]" dir="auto" required value={keep} onChange={(e) => setKeep(e.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-muted">صفة أو تصرف تنصحه أن يغيره</span>
        <textarea className="field mt-1 min-h-[80px]" dir="auto" required value={change} onChange={(e) => setChange(e.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-muted">موقف تتذكره فيه وهو في أفضل حالته <span className="font-normal">(اختياري)</span></span>
        <textarea className="field mt-1 min-h-[80px]" dir="auto" value={best} onChange={(e) => setBest(e.target.value)} />
      </label>
      <button className="btn-primary w-full" disabled={state === "sending"}>{state === "sending" ? "يرسل…" : "أرسل ردي"}</button>
      {state === "error" ? <p className="text-sm text-bad" role="alert">{err}</p> : null}
    </form>
  );
}
