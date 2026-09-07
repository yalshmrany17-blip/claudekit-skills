"use client";

import { useEffect, useState } from "react";
import { PENDING_KEY } from "@/components/TestClient";
import { ReportView } from "@/components/ReportView";
import { Big5Bars, Gauge, StatusChips } from "@/components/ScoreBars";
import { buildReport } from "@/lib/engine/report";
import { score } from "@/lib/engine/scoring";
import type { Answers, Result } from "@/lib/engine/types";

/** نتيجة محلية بلا حساب: تُستخدم في التطوير أو حين لا يُضبط الخادم. */
export function LocalResults() {
  const [data, setData] = useState<{ answers: Answers; result: Result } | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      if (!raw) return setData(null);
      const answers = JSON.parse(raw) as Answers;
      setData({ answers, result: score(answers) });
    } catch {
      setData(null);
    }
  }, []);

  if (data === undefined) return <div className="container-prose py-12 text-muted">يحسب…</div>;
  if (data === null)
    return (
      <div className="container-prose py-12">
        <div className="card">
          <h1 className="text-xl font-bold">لا توجد نتيجة محفوظة في هذا المتصفح</h1>
          <a href="/test" className="btn-primary mt-4">ابدأ التقييم</a>
        </div>
      </div>
    );

  const blocks = buildReport(data.result, data.answers);
  return (
    <div className="container-prose py-10 space-y-8">
      <div className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-muted">نتيجة محلية: لم تُحفظ في حساب. لحفظها والحصول على التقرير الكامل يلزم ضبط الخادم.</div>
      <Gauge score={data.result.index.score} band={data.result.index.band} />
      <StatusChips result={data.result} />
      <div className="card"><h2 className="mb-3 text-lg font-bold">سمات الشخصية</h2><Big5Bars big5={data.result.big5} /></div>
      <ReportView blocks={blocks} unlocked={false} />
    </div>
  );
}
