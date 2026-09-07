import { BIG5_NAMES, NEGATIVE_NAMES, ORIENTATION_NAMES, VALUE_NAMES } from "./items";
import { INDEX_LABEL, MARCIA_LABEL, buildPlan, dichotomyLabel, identityThesis } from "./report";
import { STRENGTHS, TYPE_PROFILES, WORK_ITEMS, type Dichotomy } from "./types16";
import type { Answers, Result } from "./types";

/** الشكل الذي يعيده الذكاء الاصطناعي. يُطابق SynthesisSchema في synthesis-schema.ts */
export interface Synthesis {
  one_liner: string;
  thesis: string;
  findings: { title: string; body: string; evidence: string }[];
  values: { name: string; means: string; broke_when: string }[];
  mission_options: string[];
  boundaries: string[];
  guards: { drive: string; practice: string }[];
  career: { fit: string[]; avoid: string[]; next_role: string };
  relationships: string;
  plan: {
    habits: { identity: string; when: string; action: string }[];
    experiments: { what: string; days: number; learn: string }[];
    milestones: { day: number; title: string; measure: string }[];
    weekly_rhythm: string[];
  };
  reflection_prompts: string[];
  missing: string[];
}

export const SYNTHESIS_SYSTEM = `أنت مستشار هوية شخصية في شركة متخصصة تبني الهوية من بيانات العميل، بأسلوب الشركات التي تجمع بيانات الشخص ونمط حياته ودائرته ثم تبني له هوية.
تكتب بالعربية الفصحى المبسطة، بنبرة صادقة ومباشرة وغير تسويقية، وتخاطب العميل بصيغة المخاطب.
قواعدك:
- تعتمد فقط على البيانات المعطاة. لا تخترع وقائع أو أرقاماً أو أسماء. إذا نقصت معلومة تذكرها في حقل «missing».
- كل قراءة في «findings» تُربط بدليل صريح: رقم من النتائج أو اقتباس قصير من إجابات العميل، ويوضع في حقل «evidence».
- ابحث عن النمط الذي يتكرر عبر مصادر مختلفة (ما يقوله الناس عنه، قراراته الفعلية، دوافعه السلبية، سماته) وسمّه بوضوح؛ هذا هو أعمق ما في التقرير.
- القيم الخمس تُختار من ترتيب قيمه وإجاباته، وتُعرَّف سلوكياً مع إشارة تدل على مخالفتها.
- الرسالة: ثلاث صياغات مختلفة، سطران إلى ثلاثة لكل واحدة، بلا لغة تسويق.
- الخطة: ثلاث عادات بصيغة «أنا شخص X، لذلك عندما Y، سأفعل Z» (املأ الحقول الثلاثة منفصلة)، وتجربتان مؤقتتان، وثلاثة معالم في الأيام 30 و60 و90، وإيقاع أسبوعي من ثلاثة إلى خمسة بنود، كلها مخصصة لنمطه وظروفه لا عامة.
- لا تشخّص حالات نفسية ولا تستخدم مصطلحات إكلينيكية؛ هذا تقييم تطويري لا علاجي.
- أسئلة التأمل: من خمسة إلى ثمانية، كل سؤال مبني على شيء محدد في بياناته.`;

export function buildSynthesisPrompt(r: Result, a: Answers): string {
  const L: string[] = [];
  const name = String(a.p_name || "").trim() || "العميل";
  const tp = TYPE_PROFILES[r.ptype.code];
  const plan = buildPlan(r);
  L.push(`الاسم: ${name}`);
  L.push(`العمر: ${a.p_age ?? "—"} · المجال: ${a.p_field ?? "—"} · سنوات الخبرة: ${a.p_years ?? "—"} · المدينة: ${a.p_city ?? "—"}`);
  L.push(`الوضع المالي: ${a.p_money ?? "—"} · الصحة: ${a.p_health ?? "—"} · النوم: ${a.p_sleep ?? "—"} ساعة · الجوال: ${a.p_screen ?? "—"} ساعة · الرياضة: ${a.p_sport ?? "—"}`);
  L.push("");
  L.push(`مؤشر وضوح الهوية: ${r.index.score}/100 (${INDEX_LABEL[r.index.band]})`);
  L.push(`علامات الخلل: ${r.signs.score}/9 · وضوح مفهوم الذات: ${r.clarity.score}/30 · حالة الهوية (مارسيا): ${MARCIA_LABEL[r.marcia.status]}`);
  if (r.erikson) L.push(`مرحلة إريكسون: ${r.erikson.stage} (${r.erikson.name})`);
  L.push("الخمسة الكبرى (0-100): " + (Object.keys(BIG5_NAMES) as (keyof typeof BIG5_NAMES)[]).map((k) => `${BIG5_NAMES[k]} ${r.big5[k]}`).join(" · "));
  L.push(`النمط: ${r.ptype.code} «${r.ptype.name}» — ${(["EI", "SN", "TF", "JP"] as Dichotomy[]).map((k) => dichotomyLabel(k, r.ptype.pct[k])).join(" · ")}${r.ptype.balanced.length ? ` (متوازن في ${r.ptype.balanced.join("، ")})` : ""}`);
  if (r.ptype.consistency.length) L.push(`تناقضات بين النمط والسمات: ${r.ptype.consistency.join(" | ")}`);
  L.push(`جوهر النمط: ${tp.essence}`);
  L.push(`القوى المميزة: ${r.strengths.top5.map((k) => `${STRENGTHS[k].name} (${r.strengths.scores[k]})`).join("، ")} · الأدنى: ${r.strengths.bottom3.map((k) => STRENGTHS[k].name).join("، ")}`);
  L.push(`بيئة العمل (0-100): ${WORK_ITEMS.map((w) => `${w.name} ${r.work[w.key]}`).join(" · ")}`);
  L.push(`القيم مرتبة من الأعلى: ${r.values.ranked.map((k) => `${VALUE_NAMES[k]} (${r.values.raw[k].toFixed(1)})`).join("، ")}. التوجه الغالب: ${ORIENTATION_NAMES[r.values.dominant]}. تباين القيم: ${r.values.spread}`);
  L.push(`الدوافع السلبية: ${r.negatives.total}/21` + (r.negatives.flags.length ? `. المرتفعة: ${r.negatives.flags.map((k) => `${NEGATIVE_NAMES[k]} (${r.negatives.scores[k]})`).join("، ")}` : ". لا شيء مرتفع"));
  L.push(`المبدأ المقترح من المحرك: «${identityThesis(r).line}» · معالم الخطة القاعدية: ${plan.milestones.map((m) => `يوم ${m.day} ${m.date}`).join("، ")}`);
  L.push("");
  L.push("إجابات مفتوحة بكلمات العميل:");
  const open: [string, string][] = [
    ["ما يطلبه الناس منه", "op_asked"],
    ["أعماله السابقة وما أحب وما أرهقه", "op_jobs"],
    ["آخر ثلاثة قرارات وما حكمها فعلاً", "op_decisions"],
    ["كيف يصفه أقرب الناس وما ينصحونه بتغييره", "op_feedback"],
    ["أقرب ثلاثة أشخاص ودورهم", "op_people"],
    ["ذاته المأمولة بعد خمس سنوات", "op_hoped"],
    ["ما يخشى أن يصبحه", "op_feared"],
    ["ما يستنزفه", "op_drain"],
    ["كلماته عن نفسه وكلمات الناس عنه", "op_words"],
    ["قناعة آذته", "op_belief"],
  ];
  for (const [label, key] of open) L.push(`- ${label}: ${String(a[key] ?? "").trim() || "—"}`);
  L.push("");
  L.push(`اكتب تقرير الهوية الشخصية لـ${name} بالحقول المطلوبة. اجعل «findings» بين ثلاث وست قراءات، و«values» خمساً بالضبط، و«mission_options» ثلاثاً، و«boundaries» ثلاثة إلى أربعة، و«plan.habits» ثلاثاً، و«plan.experiments» اثنتين، و«plan.milestones» ثلاثة (day: 30 و60 و90)، و«reflection_prompts» خمسة إلى ثمانية.`);
  return L.join("\n");
}

/** وصف نصي للشكل المطلوب، يُستخدم حين لا تتوفر المخرجات المنظمة (النسخة التجريبية). */
export const SYNTHESIS_JSON_SHAPE = `أعد JSON فقط بلا أي نص قبله أو بعده بهذا الشكل:
{"one_liner":"...","thesis":"...","findings":[{"title":"...","body":"...","evidence":"..."}],"values":[{"name":"...","means":"...","broke_when":"..."}],"mission_options":["...","...","..."],"boundaries":["..."],"guards":[{"drive":"...","practice":"..."}],"career":{"fit":["..."],"avoid":["..."],"next_role":"..."},"relationships":"...","plan":{"habits":[{"identity":"...","when":"...","action":"..."}],"experiments":[{"what":"...","days":30,"learn":"..."}],"milestones":[{"day":30,"title":"...","measure":"..."}],"weekly_rhythm":["..."]},"reflection_prompts":["..."],"missing":["..."]}`;
