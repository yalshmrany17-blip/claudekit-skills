"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IdentityDocView } from "@/components/IdentityDocView";
import { builderHints, composeMission, identityFilled, identityToText, type IdentityDoc } from "@/lib/engine/identity";
import type { Synthesis } from "@/lib/engine/synthesis";
import type { Answers, Result } from "@/lib/engine/types";
import { getBrowserClient } from "@/lib/supabase/client";

const STEPS = ["سطر التعريف", "القيم الخمس", "الرسالة", "التموضع والركائز", "الهوية الظاهرة", "الحدود", "الوثيقة"];

type Props = {
  assessmentId: string;
  userId: string | null;
  result: Result;
  answers: Answers;
  synthesis: Synthesis | null;
  initial: IdentityDoc;
  name: string;
};

function Hint({ title, items, onUse }: { title: string; items: string[]; onUse?: (s: string) => void }) {
  if (!items.length) return null;
  return (
    <div className="rounded-lg border border-line bg-panel p-3 text-sm">
      <div className="font-semibold text-muted">{title}</div>
      <ul className="mt-1 space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start justify-between gap-2">
            <span>{it}</span>
            {onUse ? (
              <button type="button" className="btn min-h-[30px] px-2 py-0 text-xs" onClick={() => onUse(it)}>استخدم</button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IdentityBuilder({ assessmentId, userId, result, answers, synthesis, initial, name }: Props) {
  const [doc, setDoc] = useState<IdentityDoc>(initial);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "local" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  const hints = useMemo(() => builderHints(result, answers, synthesis), [result, answers, synthesis]);
  const localKey = `ic_identity_${assessmentId}`;

  const persist = useCallback(
    async (d: IdentityDoc) => {
      const payload = { ...d, updatedAt: Date.now() };
      try {
        localStorage.setItem(localKey, JSON.stringify(payload));
      } catch {}
      const sb = getBrowserClient();
      if (!sb || !userId || assessmentId === "local") {
        setStatus("local");
        return;
      }
      setStatus("saving");
      const { error } = await sb.from("identities").upsert({ assessment_id: assessmentId, user_id: userId, doc: payload, updated_at: new Date().toISOString() });
      setStatus(error ? "error" : "saved");
    },
    [assessmentId, userId, localKey],
  );

  useEffect(() => {
    if (!dirty.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => persist(doc), 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [doc, persist]);

  function update(fn: (d: IdentityDoc) => IdentityDoc) {
    dirty.current = true;
    setDoc((d) => fn(structuredClone(d)));
  }

  const pct = identityFilled(doc);

  const field = (label: string, value: string, set: (v: string) => void, placeholder = "", multiline = false) => (
    <label className="block">
      <span className="text-sm font-semibold text-muted">{label}</span>
      {multiline ? (
        <textarea className="field mt-1 min-h-[88px]" dir="auto" value={value} placeholder={placeholder} onChange={(e) => set(e.target.value)} />
      ) : (
        <input className="field mt-1" dir="auto" value={value} placeholder={placeholder} onChange={(e) => set(e.target.value)} />
      )}
    </label>
  );

  return (
    <div className="container-prose py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent-deep">مرحلة البناء{name ? ` · ${name}` : ""}</p>
          <h1 className="display mt-1 text-4xl">اصنع هويتك</h1>
          <p className="mt-1 max-w-prose text-muted">تكتبها أنت بكلماتك. الاقتراحات على اليسار مأخوذة من نتائجك وقراءة الشركة، وليست جواباً جاهزاً.</p>
        </div>
        <div className="text-sm text-muted">
          {pct}% مكتمل ·{" "}
          {status === "saving" ? "يحفظ…" : status === "saved" ? "محفوظ في حسابك" : status === "local" ? "محفوظ في هذا المتصفح" : status === "error" ? "تعذر الحفظ" : "يُحفظ تلقائياً"}
        </div>
      </header>

      <nav className="mt-5 flex flex-wrap gap-1 text-sm" aria-label="خطوات البناء">
        {STEPS.map((s, i) => (
          <button key={s} type="button" className={`rounded-full border px-3 py-1 ${i === step ? "border-accent bg-accent-soft font-semibold text-accent-deep" : "border-line bg-panel text-muted"}`} onClick={() => setStep(i)}>
            {i + 1}. {s}
          </button>
        ))}
      </nav>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          {step === 0 ? (
            <>
              <p>سطر واحد يعرّف بك. ليس شعاراً بل وصفاً صادقاً لدورك وما تفعله، تقدر أن تقوله في أول دقيقة من أي لقاء.</p>
              {field("أنا شخص…", doc.line, (v) => update((d) => ({ ...d, line: v })), "أنا شخص استراتيجي مبدع، يُثبت قبل أن يقول.")}
            </>
          ) : null}

          {step === 1 ? (
            <>
              <p>خمس قيم، ولكل قيمة تعريف سلوكي وإشارة تخبرك أنك خالفتها. القيمة بلا تعريف مجرد كلمة جميلة.</p>
              {doc.values.map((v, i) => (
                <div key={i} className="card space-y-2">
                  <div className="text-sm font-semibold text-accent-deep">القيمة {i + 1}</div>
                  {field("الاسم", v.name, (x) => update((d) => { d.values[i].name = x; return d; }), "الصدق")}
                  {field("تعني عندي سلوكياً", v.means, (x) => update((d) => { d.values[i].means = x; return d; }), "أقول ما عندي بحجمه الحقيقي")}
                  {field("أعرف أنني خالفتها عندما", v.broke, (x) => update((d) => { d.values[i].broke = x; return d; }), "أكبّر الصورة أمام الناس")}
                </div>
              ))}
            </>
          ) : null}

          {step === 2 ? (
            <>
              <p>سطران إلى ثلاثة، بينك وبين نفسك، بلا لغة تسويق. ابدأ بالمكونات ثم اكتب الصياغة النهائية.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {field("أنا (دورك)", doc.mission.role, (v) => update((d) => { d.mission.role = v; return d; }), "مهندس، معلمة، مؤسس")}
                {field("أساعد (من؟)", doc.mission.who, (v) => update((d) => { d.mission.who = v; return d; }), "أصحاب المشاريع الصغيرة")}
                {field("على (ماذا؟)", doc.mission.what, (v) => update((d) => { d.mission.what = v; return d; }), "أن ينمو عملهم بلا فوضى")}
                {field("من خلال (كيف؟)", doc.mission.how, (v) => update((d) => { d.mission.how = v; return d; }), "أدوات عملية وحالات موثقة")}
                <div className="md:col-span-2">{field("لأن (لماذا يهمك؟)", doc.mission.why, (v) => update((d) => { d.mission.why = v; return d; }), "لأنني مررت بالتجربة نفسها")}</div>
              </div>
              <div className="readout"><div className="text-sm font-semibold text-accent-deep">الصياغة المركبة</div><p className="mt-1">{composeMission(doc.mission) || "اكتب المكونات وستتركب الجملة هنا."}</p></div>
              {field("الرسالة النهائية", doc.mission.final, (v) => update((d) => { d.mission.final = v; return d; }), "اكتبها بأسلوبك", true)}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <p>جملة تموضع تجيب: لمن، ماذا، وما الفرق. ثم ثلاث ركائز هي المواضيع أو مجالات الخبرة التي ستُعرف بها ولن تخرج عنها.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {field("لـ (الجمهور)", doc.positioning.for, (v) => update((d) => { d.positioning.for = v; return d; }))}
                {field("أقدم (ماذا)", doc.positioning.what, (v) => update((d) => { d.positioning.what = v; return d; }))}
                {field("على عكس (البدائل)", doc.positioning.unlike, (v) => update((d) => { d.positioning.unlike = v; return d; }), "الاستشارات النظرية")}
                {field("لأنني (الدليل)", doc.positioning.because, (v) => update((d) => { d.positioning.because = v; return d; }), "أنفذ بنفسي وأوثّق النتيجة")}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {doc.pillars.map((p, i) => (
                  <div key={i}>{field(`الركيزة ${i + 1}`, p, (v) => update((d) => { d.pillars[i] = v; return d; }))}</div>
                ))}
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <p>صوتك ولبسك وألوانك وأسلوب تواصلك. الثبات أهم من الجمال: شيء واحد يعرفك به الناس.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {field("نبرتك", doc.visible.tone, (v) => update((d) => { d.visible.tone = v; return d; }), "مباشر وهادئ")}
                {field("أسلوب اللبس الثابت", doc.visible.dress, (v) => update((d) => { d.visible.dress = v; return d; }))}
                {field("ألوانك الثلاثة", doc.visible.colors, (v) => update((d) => { d.visible.colors = v; return d; }), "أبيض، كحلي، رملي")}
                {field("علامتك المميزة", doc.visible.signature, (v) => update((d) => { d.visible.signature = v; return d; }), "جملة أو عادة صغيرة ثابتة")}
                {field("ثلاث كلمات يصفك بها الناس اليوم", doc.visible.now3, (v) => update((d) => { d.visible.now3 = v; return d; }))}
                {field("ثلاث كلمات تريدها بعد سنة", doc.visible.goal3, (v) => update((d) => { d.visible.goal3 = v; return d; }))}
              </div>
              {field("نبذتك في خمسين كلمة", doc.visible.bio, (v) => update((d) => { d.visible.bio = v; return d; }), "", true)}
            </>
          ) : null}

          {step === 5 ? (
            <>
              <p>الهوية تتحدد بما ترفضه بقدر ما تتحدد بما تفعله. ثلاثة إلى أربعة أشياء تقول لها لا حتى لو جاءت بمال.</p>
              {doc.boundaries.map((b, i) => (
                <div key={i}>{field(`لا أفعل ${i + 1}`, b, (v) => update((d) => { d.boundaries[i] = v; return d; }))}</div>
              ))}
              {doc.boundaries.length < 4 ? (
                <button type="button" className="btn" onClick={() => update((d) => { d.boundaries.push(""); return d; })}>أضف حداً رابعاً</button>
              ) : null}
            </>
          ) : null}

          {step === 6 ? (
            <div className="card">
              <IdentityDocView doc={doc} name={name} />
              <div className="mt-5 flex flex-wrap gap-2 no-print">
                <button type="button" className="btn" onClick={() => window.print()}>طباعة أو حفظ PDF</button>
                <button type="button" className="btn" onClick={async () => { try { await navigator.clipboard.writeText(identityToText(doc, name)); } catch {} }}>نسخ النص</button>
                <Link href={`/plan/${assessmentId}`} className="btn-primary">انتقل إلى خطة التسعين يوماً</Link>
              </div>
            </div>
          ) : null}

          <div className="flex gap-2 pt-2 no-print">
            {step > 0 ? <button type="button" className="btn" onClick={() => setStep(step - 1)}>السابق</button> : null}
            {step < STEPS.length - 1 ? <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>التالي</button> : null}
          </div>
        </div>

        <aside className="space-y-3 no-print">
          <div className="text-sm font-semibold">اقتراحات من نتائجك</div>
          {step === 0 ? (
            <>
              <Hint title="من قراءة الشركة" items={hints.oneLiner ? [hints.oneLiner] : []} onUse={(s) => update((d) => ({ ...d, line: s }))} />
              <Hint title="نمطك" items={[hints.typeName]} />
              <Hint title="قواك المميزة" items={hints.strengths} />
              <Hint title="ما يطلبه الناس منك" items={hints.asked ? [hints.asked] : []} />
            </>
          ) : null}
          {step === 1 ? (
            <>
              <Hint title="قيمك الأعلى في التقييم" items={hints.values.map((v) => `${v.name}: ${v.desc}`)} onUse={(s) => update((d) => { const i = d.values.findIndex((x) => !x.name); if (i >= 0) d.values[i].name = s.split(":")[0]; return d; })} />
              <Hint title="اقتراح قراءة الشركة" items={hints.aiValues.map((v) => `${v.name}: ${v.means}`)} onUse={(s) => update((d) => { const i = d.values.findIndex((x) => !x.name); const src = hints.aiValues.find((v) => s.startsWith(v.name)); if (i >= 0 && src) d.values[i] = { name: src.name, means: src.means, broke: src.broke_when }; return d; })} />
            </>
          ) : null}
          {step === 2 ? (
            <>
              <Hint title="ثلاث صياغات مقترحة" items={hints.missionOptions} onUse={(s) => update((d) => { d.mission.final = s; return d; })} />
              <Hint title="ذاتك المأمولة بكلماتك" items={hints.hoped ? [hints.hoped] : []} />
            </>
          ) : null}
          {step === 3 ? (
            <>
              <Hint title="أدوار تناسبك" items={hints.careerFit} onUse={(s) => update((d) => { const i = d.pillars.findIndex((x) => !x); if (i >= 0) d.pillars[i] = s; return d; })} />
              <Hint title="أدوار تستنزفك" items={hints.careerAvoid} />
            </>
          ) : null}
          {step === 4 ? <Hint title="كلماتك وكلمات الناس" items={hints.words ? [hints.words] : []} /> : null}
          {step === 5 ? <Hint title="حدود مقترحة" items={hints.boundaries} onUse={(s) => update((d) => { const i = d.boundaries.findIndex((x) => !x); if (i >= 0) d.boundaries[i] = s; else if (d.boundaries.length < 4) d.boundaries.push(s); return d; })} /> : null}
          {step === 6 ? <p className="text-sm text-muted">القسم الأول من الوثيقة يصلح للنشر؛ القيم والحدود لك وحدك.</p> : null}
        </aside>
      </div>
    </div>
  );
}
