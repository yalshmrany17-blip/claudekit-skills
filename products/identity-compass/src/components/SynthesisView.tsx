"use client";

import { useState } from "react";
import type { Synthesis } from "@/lib/engine/synthesis";

export function SynthesisBody({ s }: { s: Synthesis }) {
  return (
    <div className="mt-4 space-y-6">
      <div>
        <p className="display text-2xl text-accent-deep">{s.one_liner}</p>
        <p className="mt-1 font-semibold">مبدأ هويتك: «{s.thesis}»</p>
      </div>

      <div>
        <h3 className="text-lg font-bold">ماذا تقول بياناتك</h3>
        <ol className="mt-2 space-y-3">
          {s.findings.map((f, i) => (
            <li key={i} className="rounded-lg border border-line px-4 py-3">
              <div className="font-bold">{f.title}</div>
              <p className="mt-1 max-w-prose">{f.body}</p>
              <p className="mt-1 text-sm text-muted">الدليل: {f.evidence}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-bold">قيمك الخمس</h3>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {s.values.map((v, i) => (
            <div key={i} className="rounded-lg bg-accent-soft px-4 py-3 text-sm">
              <div className="display text-xl text-accent-deep">{v.name}</div>
              <div className="mt-1"><span className="font-semibold text-muted">تعني عندي:</span> {v.means}</div>
              <div className="mt-1"><span className="font-semibold text-muted">خالفتها عندما:</span> {v.broke_when}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold">ثلاث صياغات لرسالتك</h3>
        <ol className="mt-2 list-decimal space-y-2 ps-6">
          {s.mission_options.map((m, i) => (
            <li key={i} className="max-w-prose">{m}</li>
          ))}
        </ol>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">حدودك</h3>
          <ul className="mt-2 list-disc space-y-1 ps-6">
            {s.boundaries.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">ما تحرسه</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {s.guards.map((g, i) => (
              <li key={i}><span className="font-semibold">{g.drive}:</span> {g.practice}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">عملك ومسارك</h3>
          <p className="mt-2 text-sm"><span className="font-semibold text-muted">يناسبك:</span> {s.career.fit.join("؛ ")}</p>
          <p className="mt-1 text-sm"><span className="font-semibold text-muted">يستنزفك:</span> {s.career.avoid.join("؛ ")}</p>
          <p className="mt-1 text-sm"><span className="font-semibold text-muted">الدور القادم:</span> {s.career.next_role}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">علاقاتك</h3>
          <p className="mt-2 max-w-prose">{s.relationships}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold">أسئلة للتأمل</h3>
        <ul className="mt-2 list-disc space-y-1 ps-6">
          {s.reflection_prompts.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      {s.missing?.length ? (
        <p className="text-sm text-muted">لتحسين هذا التقرير: {s.missing.join("؛ ")}</p>
      ) : null}
    </div>
  );
}

export function SynthesisView({ assessmentId, existing, onData }: { assessmentId: string; existing: Synthesis | null; onData?: (s: Synthesis) => void }) {
  const [data, setData] = useState<Synthesis | null>(existing);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [err, setErr] = useState("");

  async function generate() {
    setState("loading");
    setErr("");
    try {
      const res = await fetch(`/api/reports/${assessmentId}/synthesis`, { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "تعذر التوليد");
      setData(j as Synthesis);
      onData?.(j as Synthesis);
      setState("idle");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر التوليد");
      setState("error");
    }
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">قراءة الشركة لبياناتك</h2>
        {!data ? (
          <button className="btn-primary no-print" onClick={generate} disabled={state === "loading"}>
            {state === "loading" ? "يقرأ إجاباتك ويكتب… نحو دقيقتين" : "اكتب تقريري من إجاباتي"}
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted">توليف يكتبه Claude من أرقامك وإجاباتك المفتوحة فقط: القراءات بدليل، القيم الخمس، الرسالة، الحدود، المسار، وخطة مخصصة. يُحفظ في حسابك.</p>
      {state === "error" ? <p className="mt-3 text-sm text-bad" role="alert">{err}</p> : null}
      {data ? <SynthesisBody s={data} /> : null}
    </section>
  );
}
