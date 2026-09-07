import type { IdentityDoc } from "./identity";
import { composeMission } from "./identity";
import { VALUE_NAMES } from "./items";
import { INDEX_LABEL } from "./report";
import type { Answers, Result } from "./types";

/** رد واحد من شخص على رسالة التغذية الراجعة */
export interface FeedbackResponse {
  relation?: string | null;
  keep: string;
  change: string;
  best?: string | null;
  created_at?: string;
}

/** خلاصة الردود كما يعيدها الذكاء الاصطناعي */
export interface FeedbackSummary {
  keep_themes: { theme: string; count: number; quotes: string[] }[];
  change_themes: { theme: string; count: number; quotes: string[] }[];
  best_pattern: string;
  blind_spots: string[];
  open_area: string[];
  advice: string;
}

/** مراجعة وضوح وثيقة الهوية كما يعيدها الذكاء الاصطناعي */
export interface IdentityReview {
  clarity_score: number;
  verdict: string;
  strengths: string[];
  issues: { field: string; problem: string; suggestion: string }[];
  contradictions: string[];
  next_edit: string;
}

export const FEEDBACK_RELATIONS = ["صديق", "زميل عمل", "مدير أو عميل", "من العائلة", "أخرى"];

export function feedbackMessage(name: string, url: string) {
  const who = name ? `أنا ${name}` : "أنا";
  return `مساء الخير، ${who} أعمل على هويتي الشخصية ورأيك يهمني. أحتاج منك ثلاثة أشياء بصراحة كاملة، دقيقتان فقط: صفة تنصحني أعززها، صفة تنصحني أغيرها، وموقف كنت فيه في أفضل حالتي. الرابط: ${url}\nلن آخذ الكلام إلا بالإيجاب، وشكراً لك مقدماً.`;
}

export const FEEDBACK_SUMMARY_SYSTEM = `أنت مستشار هوية شخصية تحلل ردود أشخاص مقربين عن عميلك. تكتب بالعربية الفصحى المبسطة وتخاطب العميل بصيغة المخاطب.
قواعدك: استخرج ما يتكرر فعلاً عبر الردود ولا تخترع ما لم يُقل. اقتبس من الردود بكلمات أصحابها القصيرة. لا تشخّص حالات نفسية. المنطقة العمياء هي ما قاله الناس ولا يظهر في وصف العميل لنفسه، والمنطقة المفتوحة ما اتفق عليه الطرفان.`;

export function buildFeedbackSummaryPrompt(responses: FeedbackResponse[], a: Answers, r: Result): string {
  const L: string[] = [];
  const name = String(a.p_name || "").trim() || "العميل";
  L.push(`العميل: ${name}. كلماته عن نفسه وكلمات الناس عنه كما كتبها هو: ${a.op_words || "—"}`);
  L.push(`كيف يظن أن أقرب الناس يصفونه: ${a.op_feedback || "—"}`);
  L.push(`نمطه: ${r.ptype.code} ${r.ptype.name} · دوافعه السلبية المرتفعة: ${r.negatives.flags.join("، ") || "لا شيء"}`);
  L.push("");
  L.push(`الردود (${responses.length}):`);
  responses.forEach((x, i) => {
    L.push(`${i + 1}. [${x.relation || "غير محدد"}] يعزز: ${x.keep} | يغير: ${x.change}${x.best ? ` | في أفضل حالته: ${x.best}` : ""}`);
  });
  L.push("");
  L.push("أعد: keep_themes (الصفات التي تكررت ليعززها مع عدد المرات واقتباسات قصيرة)، change_themes (ما تكرر ليغيره)، best_pattern (ما يجمع قصص أفضل حالاته في جملة)، blind_spots (ما قاله الناس ولا يظهر في وصفه لنفسه)، open_area (ما اتفق عليه هو والناس)، advice (نصيحة واحدة عملية في سطرين).");
  return L.join("\n");
}

export const REVIEW_SYSTEM = `أنت محرر هوية شخصية صارم وودود. تراجع وثيقة هوية كتبها العميل بنفسه وتحكم على وضوحها: هل سطر التعريف محدد ويميّزه عن غيره؟ هل كل قيمة معرّفة سلوكياً بحيث يمكن معرفة مخالفتها؟ هل الرسالة تقول لمن وماذا ولماذا بلا كلام عام؟ هل التموضع يذكر فرقاً حقيقياً؟ هل الحدود قابلة للتطبيق؟ وهل تتناقض الوثيقة مع بياناته (قيمه المقاسة، دوافعه السلبية، ما يقوله الناس عنه)؟
تكتب بالعربية الفصحى المبسطة بصيغة المخاطب، وتقترح تعديلاً محدداً لكل مشكلة بكلمات يقدر أن ينسخها. لا تعيد كتابة الوثيقة كاملة.`;

export function buildReviewPrompt(doc: IdentityDoc, r: Result, a: Answers, feedback?: FeedbackSummary | null): string {
  const L: string[] = [];
  L.push(`مؤشر وضوح الهوية المقاس: ${r.index.score} (${INDEX_LABEL[r.index.band]}) · النمط: ${r.ptype.code} ${r.ptype.name}`);
  L.push(`قيمه المقاسة من الأعلى: ${r.values.ranked.slice(0, 5).map((k) => VALUE_NAMES[k]).join("، ")} · الأدنى: ${r.values.bottom2.map((k) => VALUE_NAMES[k]).join("، ")}`);
  L.push(`دوافعه السلبية المرتفعة: ${r.negatives.flags.join("، ") || "لا شيء"}`);
  L.push(`ما يطلبه الناس منه: ${a.op_asked || "—"} · قراراته الأخيرة وما حكمها: ${a.op_decisions || "—"} · ما يخشى أن يصبحه: ${a.op_feared || "—"}`);
  if (feedback) L.push(`خلاصة ردود المقربين: يعزز ${feedback.keep_themes.map((t) => t.theme).join("، ")} · يغير ${feedback.change_themes.map((t) => t.theme).join("، ")} · منطقة عمياء: ${feedback.blind_spots.join("، ")}`);
  L.push("");
  L.push("وثيقة الهوية كما كتبها:");
  L.push(`سطر التعريف: ${doc.line || "—"}`);
  doc.values.forEach((v, i) => { if (v.name) L.push(`القيمة ${i + 1}: ${v.name} | تعني: ${v.means || "—"} | خالفتها عندما: ${v.broke || "—"}`); });
  L.push(`الرسالة: ${doc.mission.final || composeMission(doc.mission) || "—"}`);
  L.push(`التموضع: لـ ${doc.positioning.for || "—"} | أقدم ${doc.positioning.what || "—"} | على عكس ${doc.positioning.unlike || "—"} | لأنني ${doc.positioning.because || "—"}`);
  L.push(`الركائز: ${doc.pillars.filter(Boolean).join("، ") || "—"}`);
  L.push(`الظاهر: نبرة ${doc.visible.tone || "—"} | لبس ${doc.visible.dress || "—"} | ألوان ${doc.visible.colors || "—"} | علامة ${doc.visible.signature || "—"} | اليوم «${doc.visible.now3 || "—"}» بعد سنة «${doc.visible.goal3 || "—"}»`);
  L.push(`النبذة: ${doc.visible.bio || "—"}`);
  L.push(`الحدود: ${doc.boundaries.filter(Boolean).join(" | ") || "—"}`);
  L.push("");
  L.push("أعد: clarity_score من 0 إلى 100 (100 = واضحة ومحددة ومتسقة)، verdict في جملة، strengths (ما هو واضح وجيد)، issues (لكل مشكلة: field اسم الحقل، problem، suggestion بصياغة يمكن نسخها)، contradictions (بين الوثيقة وبياناته)، next_edit (أهم تعديل واحد يبدأ به).");
  return L.join("\n");
}
