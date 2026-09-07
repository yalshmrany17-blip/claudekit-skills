import type { Plan } from "@/lib/engine/report";
import type { Synthesis } from "@/lib/engine/synthesis";

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** تقويم التسعين يوماً: 13 أسبوعاً مع العادات والتجارب والمعالم. يقبل خطة المحرك أو الخطة المخصصة من التوليف. */
export function PlanCalendar({ plan, ai }: { plan: Plan; ai?: Synthesis["plan"] | null }) {
  const habits = ai?.habits?.length ? ai.habits : plan.habits;
  const experiments = ai?.experiments?.length ? ai.experiments : plan.experiments;
  const milestones = ai?.milestones?.length
    ? ai.milestones.map((m) => ({ ...m, date: addDays(plan.start, Math.max(0, m.day - 1)) }))
    : plan.milestones;
  const weekly = ai?.weekly_rhythm?.length ? ai.weekly_rhythm : plan.weekly;

  const weeks = Array.from({ length: 13 }, (_, i) => {
    const from = addDays(plan.start, i * 7);
    const to = addDays(plan.start, i * 7 + 6);
    const dayStart = i * 7 + 1;
    const dayEnd = i * 7 + 7;
    const ms = milestones.filter((m) => m.day >= dayStart && m.day <= dayEnd);
    const exp = experiments.map((e, j) => ({ e, j })).filter(({ j }) => (j === 0 ? i < 4 : i >= 4 && i < 8));
    return { i, from, to, ms, exp };
  });

  return (
    <section className="card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">تقويم التسعين يوماً</h2>
        <span className="text-sm text-muted">{plan.start} إلى {plan.end}{ai ? " · مخصص من التوليف" : ""}</span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold">العادات الثلاث</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {habits.map((h, i) => (
              <li key={i} className="rounded-lg bg-accent-soft px-3 py-2">
                <span className="font-semibold text-accent-deep">أنا شخص {h.identity}،</span> لذلك عندما {h.when}، {h.action}.
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">التجربتان</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {experiments.map((e, i) => (
              <li key={i} className="rounded-lg border border-line px-3 py-2">
                <span className="font-semibold">الأسابيع {i === 0 ? "1 إلى 4" : "5 إلى 8"} ({e.days} يوماً):</span> {e.what}
                <div className="text-muted">ما تتعلمه: {e.learn}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mt-5 font-bold">الأسابيع</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {weeks.map((w) => (
          <div key={w.i} className={`rounded-lg border px-3 py-2 text-sm ${w.ms.length ? "border-accent bg-accent-soft" : "border-line"}`}>
            <div className="flex items-baseline justify-between">
              <span className="font-bold">الأسبوع {w.i + 1}</span>
              <span className="text-xs text-muted tabular-nums" dir="ltr">{w.from.slice(5)}</span>
            </div>
            {w.exp.map(({ j }) => (
              <div key={j} className="mt-1 text-xs text-muted">تجربة {j + 1}</div>
            ))}
            {w.ms.map((m) => (
              <div key={m.day} className="mt-1 text-xs font-semibold text-accent-deep">اليوم {m.day}: {m.title}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold">المعالم</h3>
          <ol className="mt-2 space-y-2 text-sm">
            {milestones.map((m) => (
              <li key={m.day} className="flex gap-3">
                <span className="min-w-[7.5em] font-semibold tabular-nums">اليوم {m.day} · {m.date}</span>
                <span><b>{m.title}.</b> {m.measure}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-bold">الإيقاع الأسبوعي</h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
            {weekly.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">المراجعة الكبرى: {plan.review}</p>
        </div>
      </div>
    </section>
  );
}
