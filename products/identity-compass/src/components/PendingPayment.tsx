"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** بعد الدفع: ينتظر وصول الويبهوك ثم يحدّث الصفحة. */
export function PendingPayment({ assessmentId, paid }: { assessmentId: string; paid: boolean }) {
  const router = useRouter();
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!paid || tries > 20) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/access/${assessmentId}`, { cache: "no-store" });
      const j = res.ok ? ((await res.json()) as { unlocked: boolean }) : { unlocked: false };
      if (j.unlocked) router.refresh();
      else setTries((n) => n + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [paid, tries, assessmentId, router]);

  return (
    <div className="container-prose py-12">
      <div className="card">
        {paid ? (
          <>
            <h1 className="text-xl font-bold">نؤكد دفعتك…</h1>
            <p className="mt-2 text-muted">يستغرق التأكيد ثوانٍ عادة. تبقى هذه الصفحة تتحقق تلقائياً.</p>
            {tries > 20 ? <p className="mt-2 text-sm text-bad">تأخر التأكيد. إن خُصم المبلغ فسيُفتح التقرير خلال دقائق، أو راسلنا برقم العملية.</p> : null}
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">هذا التقرير غير مفتوح بعد</h1>
            <p className="mt-2 text-muted">افتحه من صفحة النتيجة.</p>
          </>
        )}
        <Link href={`/results/${assessmentId}`} className="btn mt-4">العودة إلى النتيجة</Link>
      </div>
    </div>
  );
}
