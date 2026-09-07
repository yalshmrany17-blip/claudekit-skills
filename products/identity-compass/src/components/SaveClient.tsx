"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmailForm } from "@/components/EmailForm";
import { PENDING_KEY } from "@/components/TestClient";
import { ANSWERS_KEY } from "@/components/Wizard";
import { getBrowserClient } from "@/lib/supabase/client";

/** بعد التقييم: إن كان المستخدم مسجلاً تُرسل إجاباته المحفوظة تلقائياً، وإلا يطلب بريده. */
export function SaveClient({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "form" | "saving" | "nothing" | "error">("checking");

  useEffect(() => {
    let pending: string | null = null;
    try {
      pending = localStorage.getItem(PENDING_KEY);
    } catch {}
    if (!pending) {
      setState("nothing");
      return;
    }
    if (!loggedIn) {
      setState("form");
      return;
    }
    setState("saving");
    (async () => {
      const sb = getBrowserClient();
      if (!sb) {
        setState("error");
        return;
      }
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers: JSON.parse(pending!) }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      const { id } = (await res.json()) as { id: string };
      try {
        localStorage.removeItem(PENDING_KEY);
        localStorage.removeItem(ANSWERS_KEY);
        localStorage.removeItem(ANSWERS_KEY + "_step");
      } catch {}
      router.replace(`/results/${id}`);
    })();
  }, [loggedIn, router]);

  if (state === "checking" || state === "saving") {
    return <div className="readout">يحفظ نتيجتك…</div>;
  }
  if (state === "nothing") {
    return (
      <div className="card">
        <h1 className="text-xl font-bold">لا توجد إجابات بانتظار الحفظ</h1>
        <p className="mt-2 text-muted">ابدأ التقييم أولاً ثم عد إلى هنا.</p>
        <a href="/test" className="btn-primary mt-4">ابدأ التقييم</a>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="card">
        <h1 className="text-xl font-bold">تعذر الحفظ</h1>
        <p className="mt-2 text-muted">إجاباتك ما زالت في متصفحك. حدّث الصفحة للمحاولة مرة أخرى.</p>
      </div>
    );
  }
  return <EmailForm next="/save" title="احفظ نتيجتك" hint="انتهيت من التقييم. أدخل بريدك ليصلك رابط الدخول وتُحفظ نتيجتك في حسابك." />;
}
