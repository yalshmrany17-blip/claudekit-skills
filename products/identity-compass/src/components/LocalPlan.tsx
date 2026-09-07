"use client";

import { useEffect, useState } from "react";
import { PlanTracker } from "@/components/PlanTracker";
import { PENDING_KEY } from "@/components/TestClient";
import { emptyProgress, type PlanProgress } from "@/lib/engine/identity";
import { buildPlan, buildReport, type Plan } from "@/lib/engine/report";
import { score } from "@/lib/engine/scoring";
import type { Answers } from "@/lib/engine/types";

/** متابعة الخطة بلا حساب: من إجابات المتصفح وتُحفظ فيه. */
export function LocalPlan() {
  const [state, setState] = useState<{ plan: Plan; prompts: string[]; initial: PlanProgress; name: string } | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      if (!raw) return setState(null);
      const answers = JSON.parse(raw) as Answers;
      const result = score(answers);
      const plan = buildPlan(result);
      const prompts = buildReport(result, answers).find((b) => b.id === "reflection")?.bullets ?? [];
      const saved = localStorage.getItem("ic_plan_local");
      setState({ plan, prompts, initial: saved ? (JSON.parse(saved) as PlanProgress) : emptyProgress(), name: String(answers.p_name || "") });
    } catch {
      setState(null);
    }
  }, []);

  if (state === undefined) return <div className="container-prose py-12 text-muted">يحمّل…</div>;
  if (state === null)
    return (
      <div className="container-prose py-12">
        <div className="card">
          <h1 className="text-xl font-bold">لا توجد نتيجة في هذا المتصفح</h1>
          <a href="/test" className="btn-primary mt-4">ابدأ التقييم</a>
        </div>
      </div>
    );

  return <PlanTracker assessmentId="local" userId={null} plan={state.plan} prompts={state.prompts} initial={state.initial} name={state.name} />;
}
