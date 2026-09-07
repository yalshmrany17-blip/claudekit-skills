import type { ReportBlock } from "@/lib/engine/report";

export function ReportView({ blocks, unlocked }: { blocks: ReportBlock[]; unlocked: boolean }) {
  return (
    <div className="space-y-6">
      {blocks.map((b) => {
        const locked = b.locked && !unlocked;
        return (
          <section key={b.id} className={b.locked ? "card" : ""} aria-label={b.title}>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{b.title}</h2>
              {b.locked ? (
                <span className={`pill ${unlocked ? "bg-accent-soft text-accent-deep" : "bg-panel border border-line text-muted"}`}>{unlocked ? "التقرير الكامل" : "مغلق"}</span>
              ) : null}
            </div>
            {locked ? (
              <div className="locked-preview mt-3 space-y-2" aria-hidden="true">
                <p>هذا الجزء من التقرير الكامل. يحلل نتائجك ويحولها إلى قرارات عملية مبنية على إجاباتك أنت لا على قوالب عامة.</p>
                <p>يشمل قراءة مفصلة، وقائمة بنود، وخطوات محددة بتواريخ.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {b.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-prose">{p}</p>
                ))}
                {b.bullets?.length ? (
                  <ul className="list-disc space-y-1 ps-6 max-w-prose">
                    {b.bullets.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
