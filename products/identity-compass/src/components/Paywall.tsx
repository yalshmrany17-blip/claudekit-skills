"use client";

import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

export function Paywall({ assessmentId, userId, email }: { assessmentId: string; userId: string; email?: string }) {
  const router = useRouter();
  const paddleRef = useRef<Paddle | null>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_REPORT;
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

  useEffect(() => {
    if (!token || !priceId) return;
    initializePaddle({
      environment: env,
      token,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          setMsg("تم الدفع. نفتح تقريرك الآن…");
          setTimeout(() => router.push(`/report/${assessmentId}?paid=1`), 1200);
        }
      },
    })
      .then((p) => {
        if (p) {
          paddleRef.current = p;
          setReady(true);
        }
      })
      .catch(() => setMsg("تعذر تحميل بوابة الدفع."));
  }, [token, priceId, env, assessmentId, router]);

  function open() {
    if (!paddleRef.current || !priceId) return;
    paddleRef.current.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: email ? { email } : undefined,
      customData: { assessment_id: assessmentId, user_id: userId },
      settings: { locale: "ar", successUrl: `${window.location.origin}/report/${assessmentId}?paid=1` },
    });
  }

  if (!token || !priceId) {
    return (
      <div className="readout">
        <div className="font-bold">التقرير الكامل</div>
        <p className="mt-1 text-muted">لم تُضبط بوابة الدفع بعد. أضف متغيرات Paddle في الإعدادات ليظهر زر الشراء هنا.</p>
      </div>
    );
  }

  return (
    <div className="readout">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold">افتح التقرير الكامل</div>
          <p className="text-muted">قيمك مرتبة، ما تحرسه، مبدأ هويتك، خطة التسعين يوماً، وسرد شخصي من إجاباتك.</p>
        </div>
        <button className="btn-primary px-7 text-lg" onClick={open} disabled={!ready}>
          {ready ? `${SITE.price.report} ${SITE.price.currency} · مرة واحدة` : "يحمّل…"}
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm font-semibold">{msg}</p> : null}
    </div>
  );
}
