"use client";

import { useState } from "react";
import { feedbackMessage, type FeedbackResponse, type FeedbackSummary } from "@/lib/engine/feedback";

export function FeedbackSummaryView({ s }: { s: FeedbackSummary }) {
  return (
    <div className="mt-3 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold">ما ينصحونك أن تعززه</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {s.keep_themes.map((t, i) => (
              <li key={i}><span className="font-semibold">{t.theme}</span> <span className="text-muted">({t.count})</span>{t.quotes.length ? <span className="text-muted"> · «{t.quotes[0]}»</span> : null}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">ما ينصحونك أن تغيره</h3>
          <ul className="mt-1 space-y-1 text-sm">
            {s.change_themes.map((t, i) => (
              <li key={i}><span className="font-semibold">{t.theme}</span> <span className="text-muted">({t.count})</span>{t.quotes.length ? <span className="text-muted"> · «{t.quotes[0]}»</span> : null}</li>
            ))}
          </ul>
        </div>
      </div>
      <p><span className="font-semibold text-muted">في أفضل حالاتك:</span> {s.best_pattern}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-warn-soft px-4 py-3 text-sm"><div className="font-bold text-warn">المنطقة العمياء</div><ul className="mt-1 list-disc ps-5">{s.blind_spots.map((b, i) => <li key={i}>{b}</li>)}</ul></div>
        <div className="rounded-lg bg-good-soft px-4 py-3 text-sm"><div className="font-bold text-good">المنطقة المفتوحة</div><ul className="mt-1 list-disc ps-5">{s.open_area.map((b, i) => <li key={i}>{b}</li>)}</ul></div>
      </div>
      <p className="readout">{s.advice}</p>
    </div>
  );
}

export function FeedbackOwner({ assessmentId, token: initialToken, responses, summary: initialSummary, name, siteUrl }: { assessmentId: string; token: string | null; responses: FeedbackResponse[]; summary: FeedbackSummary | null; name: string; siteUrl: string }) {
  const [token, setToken] = useState(initialToken);
  const [summary, setSummary] = useState(initialSummary);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [err, setErr] = useState("");
  const url = token ? `${siteUrl}/f/${token}` : "";

  async function createLink() {
    setState("loading");
    const res = await fetch("/api/feedback/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ assessment_id: assessmentId }) });
    const j = await res.json();
    if (res.ok) {
      setToken(j.token);
      setState("idle");
    } else {
      setErr(j.error || "تعذر إنشاء الرابط");
      setState("error");
    }
  }

  async function summarize() {
    if (!token) return;
    setState("loading");
    const res = await fetch(`/api/feedback/${token}/summary`, { method: "POST" });
    const j = await res.json();
    if (res.ok) {
      setSummary(j as FeedbackSummary);
      setState("idle");
    } else {
      setErr(j.error || "تعذر التلخيص");
      setState("error");
    }
  }

  return (
    <div className="container-prose py-8 space-y-6">
      <header>
        <p className="text-sm font-semibold text-accent-deep">بلس · رسالة العشرة أشخاص{name ? ` · ${name}` : ""}</p>
        <h1 className="display mt-1 text-4xl">كيف يراك الناس فعلاً</h1>
        <p className="mt-1 max-w-prose text-muted">أرسل الرابط لعشرة أشخاص تثق برأيهم، لا لأقرب الناس بالضرورة، وتجنب من تعرف أنه سلبي. ردودهم تصلك مجهولة، وتظهر منطقتك العمياء التي لا يراها أي اختبار.</p>
      </header>

      <section className="card">
        {!token ? (
          <button className="btn-primary" onClick={createLink} disabled={state === "loading"}>أنشئ رابطي</button>
        ) : (
          <>
            <div className="text-sm font-semibold text-muted">رابطك</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <code className="rounded bg-accent-soft px-3 py-1 text-sm" dir="ltr">{url}</code>
              <button className="btn min-h-[36px] px-3 py-1 text-sm" onClick={async () => { try { await navigator.clipboard.writeText(url); } catch {} }}>نسخ الرابط</button>
              <button className="btn min-h-[36px] px-3 py-1 text-sm" onClick={async () => { try { await navigator.clipboard.writeText(feedbackMessage(name, url)); } catch {} }}>نسخ الرسالة الجاهزة</button>
            </div>
            <p className="mt-3 rounded-lg border border-line bg-panel px-4 py-3 text-sm">{feedbackMessage(name, url)}</p>
          </>
        )}
        {state === "error" ? <p className="mt-2 text-sm text-bad" role="alert">{err}</p> : null}
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">الردود ({responses.length})</h2>
          {responses.length >= 3 ? (
            <button className="btn-primary no-print" onClick={summarize} disabled={state === "loading"}>{state === "loading" ? "يحلل…" : summary ? "أعد التحليل" : "حلّل الردود"}</button>
          ) : (
            <span className="text-sm text-muted">التحليل يبدأ عند ثلاثة ردود</span>
          )}
        </div>
        {responses.length ? (
          <ul className="mt-3 space-y-3">
            {responses.map((r, i) => (
              <li key={i} className="rounded-lg border border-line px-4 py-3 text-sm">
                <div className="text-xs text-muted">{r.relation || "غير محدد"}{r.created_at ? ` · ${r.created_at.slice(0, 10)}` : ""}</div>
                <div className="mt-1"><span className="font-semibold text-good">يعزز:</span> {r.keep}</div>
                <div className="mt-1"><span className="font-semibold text-warn">يغير:</span> {r.change}</div>
                {r.best ? <div className="mt-1"><span className="font-semibold text-muted">في أفضل حالته:</span> {r.best}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-muted">لا ردود بعد. أرسل الرابط اليوم؛ أغلب الردود تصل خلال ثلاثة أيام.</p>
        )}
        {summary ? <FeedbackSummaryView s={summary} /> : null}
      </section>
    </div>
  );
}
