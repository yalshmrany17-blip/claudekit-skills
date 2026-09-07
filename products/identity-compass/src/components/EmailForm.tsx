"use client";

import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";

export function EmailForm({ next, title, hint }: { next: string; title: string; hint?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserClient();
    if (!sb) {
      setState("error");
      setMsg("لم يُضبط الاتصال بقاعدة البيانات بعد.");
      return;
    }
    setState("sending");
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setState("error");
      setMsg(error.message);
    } else {
      setState("sent");
    }
  }

  if (state === "sent") {
    return (
      <div className="readout">
        <div className="font-bold">أرسلنا رابط الدخول إلى {email}</div>
        <p className="mt-1 text-muted">افتح بريدك واضغط الرابط. ستعود إلى هنا مسجلاً دخولك.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card">
      <h1 className="text-xl font-bold">{title}</h1>
      {hint ? <p className="mt-1 text-muted">{hint}</p> : null}
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-muted">بريدك الإلكتروني</span>
        <input className="field mt-1" type="email" dir="ltr" required autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button className="btn-primary mt-4 w-full" disabled={state === "sending"}>
        {state === "sending" ? "يرسل…" : "أرسل رابط الدخول"}
      </button>
      {state === "error" ? <p className="mt-3 text-sm text-bad" role="alert">{msg}</p> : null}
      <p className="mt-3 text-sm text-muted">بلا كلمة مرور: رابط واحد يصلك بالبريد في كل مرة.</p>
    </form>
  );
}
