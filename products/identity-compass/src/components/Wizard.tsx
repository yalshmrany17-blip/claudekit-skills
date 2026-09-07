"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS, SCORED_ITEM_IDS } from "@/lib/engine/items";
import type { Answers, AnswerValue, Item, Section } from "@/lib/engine/types";

export const ANSWERS_KEY = "ic_answers_v1";

function loadAnswers(): Answers {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

function isAnswered(v: AnswerValue | undefined) {
  return v !== undefined && v !== null && v !== "";
}

function Scale({ item, value, from, to, onChange }: { item: Item; value: AnswerValue | undefined; from: number; to: number; onChange: (v: number) => void }) {
  const opts: number[] = [];
  for (let i = from; i <= to; i++) opts.push(i);
  return (
    <div className="seg" role="radiogroup" aria-label={item.text}>
      {opts.map((n) => (
        <button
          key={n}
          type="button"
          className="seg-btn"
          aria-pressed={String(value) === String(n)}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function YesNo({ item, value, onChange }: { item: Item; value: AnswerValue | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="seg" role="radiogroup" aria-label={item.text}>
      <button type="button" className="seg-btn px-5" aria-pressed={value === true} onClick={() => onChange(true)}>نعم</button>
      <button type="button" className="seg-btn px-5" aria-pressed={value === false} onClick={() => onChange(false)}>لا</button>
    </div>
  );
}

function ItemRow({ item, section, value, missing, onChange }: { item: Item; section: Section; value: AnswerValue | undefined; missing: boolean; onChange: (v: AnswerValue) => void }) {
  const label = (
    <span className="block font-medium">
      {item.text}
      {item.required ? <span className="ms-1 text-accent-deep" aria-hidden="true">*</span> : null}
      {item.hint ? <span className="mt-0.5 block text-sm font-normal text-muted">{item.hint}</span> : null}
    </span>
  );
  const wrap = (children: React.ReactNode) => (
    <div className={`rounded-lg border px-4 py-3 ${missing ? "border-bad bg-bad-soft" : "border-transparent"}`} data-item={item.id}>
      {children}
    </div>
  );

  switch (item.type) {
    case "text":
      return wrap(
        <label className="block">
          {label}
          <input className="field mt-2" dir="auto" placeholder={item.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </label>,
      );
    case "number":
      return wrap(
        <label className="block">
          {label}
          <input className="field mt-2 max-w-[160px]" type="number" inputMode="numeric" min={item.min} max={item.max} placeholder={item.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </label>,
      );
    case "select":
      return wrap(
        <label className="block">
          {label}
          <select className="field mt-2" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            <option value="">اختر</option>
            {item.options?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>,
      );
    case "textarea":
      return wrap(
        <label className="block">
          {label}
          <textarea className="field mt-2 min-h-[96px]" dir="auto" placeholder={item.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </label>,
      );
    case "yesno":
      return wrap(
        <div className="flex flex-wrap items-center justify-between gap-3">
          {label}
          <YesNo item={item} value={value} onChange={onChange} />
        </div>,
      );
    case "likert5":
      return wrap(
        <div className="flex flex-wrap items-center justify-between gap-3">
          {label}
          <Scale item={item} value={value} from={1} to={5} onChange={onChange} />
        </div>,
      );
    case "likert6":
      return wrap(
        <div className="flex flex-wrap items-center justify-between gap-3">
          {label}
          <Scale item={item} value={value} from={1} to={6} onChange={onChange} />
        </div>,
      );
    case "scale03":
      return wrap(
        <div className="flex flex-wrap items-center justify-between gap-3">
          {label}
          <Scale item={item} value={value} from={0} to={3} onChange={onChange} />
        </div>,
      );
    default:
      return null;
  }
  void section;
}

export function Wizard({ onComplete, submitting }: { onComplete: (answers: Answers) => void; submitting?: boolean }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [missing, setMissing] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnswers(loadAnswers());
    try {
      const s = parseInt(localStorage.getItem(ANSWERS_KEY + "_step") || "0", 10);
      if (Number.isFinite(s) && s >= 0 && s < SECTIONS.length) setStep(s);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
      localStorage.setItem(ANSWERS_KEY + "_step", String(step));
    } catch {}
  }, [answers, step, hydrated]);

  const section = SECTIONS[step];
  const answeredScored = useMemo(() => SCORED_ITEM_IDS.filter((id) => isAnswered(answers[id])).length, [answers]);
  const progress = Math.round((answeredScored / SCORED_ITEM_IDS.length) * 100);

  const setValue = useCallback((id: string, v: AnswerValue) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setMissing((m) => m.filter((x) => x !== id));
  }, []);

  function validate(): string[] {
    const miss: string[] = [];
    for (const it of section.items) {
      if (it.required && !isAnswered(answers[it.id])) miss.push(it.id);
      if (it.type === "number" && isAnswered(answers[it.id])) {
        const n = Number(answers[it.id]);
        if (!Number.isFinite(n) || (it.min !== undefined && n < it.min) || (it.max !== undefined && n > it.max)) miss.push(it.id);
      }
    }
    return miss;
  }

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const miss = validate();
    setMissing(miss);
    if (miss.length) {
      const el = document.querySelector(`[data-item="${miss[0]}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (step < SECTIONS.length - 1) {
      setStep(step + 1);
      scrollTop();
    } else {
      onComplete(answers);
    }
  }

  function prev() {
    if (step > 0) {
      setStep(step - 1);
      setMissing([]);
      scrollTop();
    }
  }

  const isLast = step === SECTIONS.length - 1;

  return (
    <div ref={topRef} className="container-prose py-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>القسم {step + 1} من {SECTIONS.length}</span>
        <span>{progress}% من الأسئلة المقيَّمة</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="display mt-6 text-4xl">{section.title}</h1>
      <p className="mt-2 max-w-prose text-muted">{section.intro}</p>
      {section.scaleLabels ? (
        <p className="mt-3 text-sm text-muted">
          <span className="font-semibold">المقياس:</span> {section.items[0].type === "scale03" ? "0" : "1"} = {section.scaleLabels[0]} · {section.items[0].type === "likert6" ? "6" : section.items[0].type === "scale03" ? "3" : "5"} = {section.scaleLabels[1]}
        </p>
      ) : null}

      {missing.length ? (
        <div className="mt-4 rounded-lg border border-bad bg-bad-soft px-4 py-2 text-sm text-bad" role="alert">
          أكمل الحقول المعلَّمة قبل المتابعة ({missing.length}).
        </div>
      ) : null}

      <div className="mt-5 space-y-1">
        {section.items.map((it) => (
          <ItemRow key={it.id} item={it} section={section} value={answers[it.id]} missing={missing.includes(it.id)} onChange={(v) => setValue(it.id, v)} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary px-7" onClick={next} disabled={submitting}>
          {submitting ? "يحسب…" : isLast ? "احسب نتيجتي" : "التالي"}
        </button>
        {step > 0 ? (
          <button type="button" className="btn" onClick={prev} disabled={submitting}>السابق</button>
        ) : null}
        <span className="text-sm text-muted">تُحفظ إجاباتك تلقائياً في هذا المتصفح.</span>
      </div>
    </div>
  );
}
