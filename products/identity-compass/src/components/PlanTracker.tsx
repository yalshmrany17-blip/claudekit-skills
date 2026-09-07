"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLAN_WEEKS, planProgressPct, weekOf, type PlanProgress } from "@/lib/engine/identity";
import type { Plan } from "@/lib/engine/report";
import { getBrowserClient } from "@/lib/supabase/client";

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function PlanTracker({ assessmentId, userId, plan, prompts, initial, name }: { assessmentId: string; userId: string | null; plan: Plan; prompts: string[]; initial: PlanProgress; name: string }) {
  const [p, setP] = useState<PlanProgress>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "local" | "error">("idle");
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const weekNow = weekOf(plan.start);
  const pct = planProgressPct(p, plan, weekNow);
  const localKey = `ic_plan_${assessmentId}`;

  const persist = useCallback(
    async (data: PlanProgress) => {
      const payload = { ...data, updatedAt: Date.now() };
      try {
        localStorage.setItem(localKey, JSON.stringify(payload));
      } catch {}
      const sb = getBrowserClient();
      if (!sb || !userId || assessmentId === "local") return setStatus("local");
      setStatus("saving");
      const { error } = await sb.from("plan_progress").upsert({ assessment_id: assessmentId, user_id: userId, data: payload, updated_at: new Date().toISOString() });
      setStatus(error ? "error" : "saved");
    },
    [assessmentId, userId, localKey],
  );

  useEffect(() => {
    if (!dirty.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(p), 600);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [p, persist]);

  function update(fn: (x: PlanProgress) => void) {
    dirty.current = true;
    setP((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }

  return (
    <div className="container-prose py-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-deep">مرحلة التطبيق{name ? ` · ${name}` : ""}</p>
          <h1 className="display mt-1 text-4xl">خطة التسعين يوماً</h1>
          <p className="mt-1 text-muted">{plan.start} إلى {plan.end} · أنت في الأسبوع {weekNow || "الصفر: تبدأ غداً"} من {PLAN_WEEKS}</p>
        </div>
        <div className="text-sm text-muted">
          الالتزام حتى الآن {pct}% · {status === "saving" ? "يحفظ…" : status === "saved" ? "محفوظ في حسابك" : status === "local" ? "محفوظ في هذا المتصفح" : status === "error" ? "تعذر الحفظ" : "يُحفظ تلقائياً"}
        </div>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true"><div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>

      <section className="card">
        <h2 className="text-lg font-bold">المعالم</h2>
        <ul className="mt-2 space-y-2">
          {plan.milestones.map((m) => (
            <li key={m.day} className="flex items-start gap-3">
              <input type="checkbox" className="mt-1.5 h-5 w-5 accent-[var(--accent)]" checked={!!p.milestones[String(m.day)]} onChange={(e) => update((x) => { x.milestones[String(m.day)] = e.target.checked; })} aria-label={m.title} />
              <div><span className="font-semibold">اليوم {m.day} · {m.date} · {m.title}.</span> <span className="text-muted">{m.measure}</span></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="text-lg font-bold">العادات أسبوعاً بأسبوع</h2>
        <p className="text-sm text-muted">علّم الأسبوع الذي التزمت فيه بالعادة أغلب أيامه. الصدق هنا هو ما يجعل المراجعة مفيدة.</p>
        <table className="mt-3 w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-2 text-start">الأسبوع</th>
              {plan.habits.map((h, i) => (
                <th key={i} className="py-2 text-start font-semibold">أنا شخص {h.identity}</th>
              ))}
              <th className="py-2 text-start">تأمل الأسبوع</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: PLAN_WEEKS }, (_, w) => {
              const week = w + 1;
              const isNow = week === weekNow;
              return (
                <tr key={week} className={`border-t border-line ${isNow ? "bg-accent-soft" : ""}`}>
                  <td className="py-2 tabular-nums">
                    <div className="font-semibold">{week}</div>
                    <div className="text-xs text-muted" dir="ltr">{addDays(plan.start, w * 7).slice(5)}</div>
                  </td>
                  {plan.habits.map((_, i) => (
                    <td key={i} className="py-2">
                      <input type="checkbox" className="h-5 w-5 accent-[var(--accent)]" checked={!!p.habits[`${week}_${i}`]} onChange={(e) => update((x) => { x.habits[`${week}_${i}`] = e.target.checked; })} aria-label={`الأسبوع ${week} العادة ${i + 1}`} />
                    </td>
                  ))}
                  <td className="py-2">
                    <details>
                      <summary className="cursor-pointer text-muted">{p.notes[String(week)] ? "مكتوب" : prompts[w % prompts.length]?.slice(0, 40) + "…"}</summary>
                      <p className="mt-1 text-xs text-muted">{prompts[w % prompts.length]}</p>
                      <textarea className="field mt-1 min-h-[70px] text-sm" dir="auto" value={p.notes[String(week)] || ""} onChange={(e) => update((x) => { x.notes[String(week)] = e.target.value; })} placeholder="ثلاثة أسطر" />
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold">التجربتان</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {plan.experiments.map((e, i) => (
            <li key={i}><span className="font-semibold">الأسابيع {i === 0 ? "1 إلى 4" : "5 إلى 8"}:</span> {e.what} <span className="text-muted">· ما تتعلمه: {e.learn}</span></li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">المراجعة الكبرى: {plan.review}. أعد التقييم يومها وقارن.</p>
        <div className="mt-4 flex flex-wrap gap-2 no-print">
          <Link href={`/build/${assessmentId}`} className="btn">وثيقة هويتي</Link>
          <Link href={`/report/${assessmentId}`} className="btn">التقرير الكامل</Link>
        </div>
      </section>
    </div>
  );
}
