"use client";

import { useEffect, useState } from "react";
import { IdentityBuilder } from "@/components/IdentityBuilder";
import { PENDING_KEY } from "@/components/TestClient";
import { draftIdentity, type IdentityDoc } from "@/lib/engine/identity";
import { score } from "@/lib/engine/scoring";
import type { Answers, Result } from "@/lib/engine/types";

/** مرحلة البناء بلا حساب: تعمل من إجابات المتصفح وتحفظ فيه. */
export function LocalBuilder() {
  const [state, setState] = useState<{ answers: Answers; result: Result; initial: IdentityDoc } | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      if (!raw) return setState(null);
      const answers = JSON.parse(raw) as Answers;
      const result = score(answers);
      const saved = localStorage.getItem("ic_identity_local");
      const initial = saved ? (JSON.parse(saved) as IdentityDoc) : draftIdentity(result, answers, null);
      setState({ answers, result, initial });
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

  return <IdentityBuilder assessmentId="local" userId={null} result={state.result} answers={state.answers} synthesis={null} initial={state.initial} name={String(state.answers.p_name || "")} />;
}
