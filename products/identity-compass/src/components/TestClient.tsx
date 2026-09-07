"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wizard, ANSWERS_KEY } from "@/components/Wizard";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Answers } from "@/lib/engine/types";

export const PENDING_KEY = "ic_pending_v1";

export function TestClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete(answers: Answers) {
    setSubmitting(true);
    setError(null);
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(answers));
    } catch {}
    const sb = getBrowserClient();
    if (!sb) {
      // بلا خادم مضبوط: نعرض النتيجة محلياً
      router.push("/results/local");
      return;
    }
    const { data } = await sb.auth.getUser();
    if (!data.user) {
      router.push("/save");
      return;
    }
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      setSubmitting(false);
      setError("تعذر حفظ النتيجة. حاول مرة أخرى.");
      return;
    }
    const { id } = (await res.json()) as { id: string };
    try {
      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(ANSWERS_KEY);
      localStorage.removeItem(ANSWERS_KEY + "_step");
    } catch {}
    router.push(`/results/${id}`);
  }

  return (
    <>
      {error ? (
        <div className="container-prose pt-6">
          <div className="rounded-lg border border-bad bg-bad-soft px-4 py-2 text-bad" role="alert">{error}</div>
        </div>
      ) : null}
      <Wizard onComplete={handleComplete} submitting={submitting} />
    </>
  );
}
