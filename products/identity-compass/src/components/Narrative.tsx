"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`l${out.length}`} className="list-disc space-y-1 ps-6">
          {list.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^#{1,3}\s/.test(line)) {
      flush();
      out.push(<h3 key={`h${out.length}`} className="mt-5 text-lg font-bold">{line.replace(/^#{1,3}\s*/, "")}</h3>);
    } else if (/^[-*•]\s/.test(line)) {
      list.push(line.replace(/^[-*•]\s*/, ""));
    } else if (/^\d+[.)]\s/.test(line)) {
      list.push(line.replace(/^\d+[.)]\s*/, ""));
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      out.push(<p key={`p${out.length}`}>{line.replace(/\*\*/g, "")}</p>);
    }
  }
  flush();
  return out;
}

export function Narrative({ assessmentId, existing }: { assessmentId: string; existing: string | null }) {
  const [text, setText] = useState(existing ?? "");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(existing ? "done" : "idle");
  const [err, setErr] = useState("");

  async function generate() {
    setState("loading");
    setText("");
    try {
      const res = await fetch(`/api/reports/${assessmentId}/narrative`, { method: "POST" });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({ error: "تعذر التوليد" }));
        throw new Error(j.error || "تعذر التوليد");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setText(acc);
      }
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر التوليد");
      setState("error");
    }
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">تقريرك الشخصي</h2>
        {state === "idle" || state === "error" ? (
          <button className="btn-primary no-print" onClick={generate}>اكتب تقريري من إجاباتي</button>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted">سرد من نحو 800 كلمة يكتبه Claude اعتماداً على أرقامك وإجاباتك المفتوحة فقط، ويُحفظ في حسابك.</p>
      {state === "loading" && !text ? <p className="mt-4 text-muted">يقرأ إجاباتك ويكتب… يستغرق هذا نحو دقيقة.</p> : null}
      {text ? <div className="mt-4 space-y-3 max-w-prose">{renderMarkdown(text)}</div> : null}
      {state === "error" ? <p className="mt-3 text-sm text-bad" role="alert">{err}</p> : null}
    </section>
  );
}
