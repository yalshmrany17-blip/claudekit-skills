import { BIG5_NAMES, NEGATIVE_NAMES, ORIENTATION_NAMES, VALUE_NAMES } from "./items";
import { INDEX_LABEL, MARCIA_LABEL, identityThesis } from "./report";
import type { Answers, Result } from "./types";

export const NARRATIVE_SYSTEM = `أنت مستشار هوية شخصية في شركة متخصصة تبني الهوية من بيانات العميل. تكتب بالعربية الفصحى المبسطة، بنبرة صادقة ومباشرة وغير تسويقية، وتخاطب العميل بصيغة المخاطب.
قواعدك:
- تعتمد فقط على البيانات المعطاة. لا تخترع وقائع أو أرقاماً أو أسماء. إذا نقصت معلومة تقول ذلك صراحة.
- تربط كل استنتاج بدليل من البيانات (رقم أو إجابة مكتوبة).
- لا تشخّص حالات نفسية ولا تستخدم مصطلحات إكلينيكية؛ هذا تقييم تطويري لا علاجي.
- تستخدم عناوين قصيرة بصيغة Markdown من المستوى الثاني (##)، وفقرات قصيرة، وقوائم عند الحاجة فقط.
- الطول بين 600 و900 كلمة.`;

export function buildNarrativePrompt(r: Result, a: Answers): string {
  const lines: string[] = [];
  const name = String(a.p_name || "").trim() || "العميل";
  lines.push(`الاسم: ${name}`);
  lines.push(`العمر: ${a.p_age ?? "—"} · المجال: ${a.p_field ?? "—"} · سنوات الخبرة: ${a.p_years ?? "—"} · المدينة: ${a.p_city ?? "—"}`);
  lines.push(`الوضع المالي: ${a.p_money ?? "—"} · الصحة: ${a.p_health ?? "—"} · النوم: ${a.p_sleep ?? "—"} ساعة · الجوال: ${a.p_screen ?? "—"} ساعة · الرياضة: ${a.p_sport ?? "—"}`);
  lines.push("");
  lines.push(`مؤشر وضوح الهوية: ${r.index.score}/100 (${INDEX_LABEL[r.index.band]})`);
  lines.push(`علامات الخلل: ${r.signs.score}/9 · وضوح مفهوم الذات: ${r.clarity.score}/30 · حالة الهوية (مارسيا): ${MARCIA_LABEL[r.marcia.status]}`);
  if (r.erikson) lines.push(`مرحلة إريكسون: ${r.erikson.stage} (${r.erikson.name})`);
  lines.push(
    "الخمسة الكبرى (0-100): " +
      (Object.keys(BIG5_NAMES) as (keyof typeof BIG5_NAMES)[]).map((k) => `${BIG5_NAMES[k]} ${r.big5[k]}`).join(" · "),
  );
  lines.push(
    `القيم مرتبة من الأعلى: ${r.values.ranked.map((k) => `${VALUE_NAMES[k]} (${r.values.raw[k].toFixed(1)})`).join("، ")}. التوجه الغالب: ${ORIENTATION_NAMES[r.values.dominant]}. تباين القيم: ${r.values.spread}`,
  );
  lines.push(
    `الدوافع السلبية: ${r.negatives.total}/21` +
      (r.negatives.flags.length ? `. المرتفعة: ${r.negatives.flags.map((k) => `${NEGATIVE_NAMES[k]} (${r.negatives.scores[k]})`).join("، ")}` : ". لا شيء مرتفع"),
  );
  const th = identityThesis(r);
  lines.push(`المبدأ المقترح من المحرك: «${th.line}»`);
  lines.push("");
  lines.push("إجابات مفتوحة بكلمات العميل:");
  lines.push(`- ما يطلبه الناس منه: ${a.op_asked || "—"}`);
  lines.push(`- ذاته المأمولة بعد خمس سنوات: ${a.op_hoped || "—"}`);
  lines.push(`- ما يخشى أن يصبحه: ${a.op_feared || "—"}`);
  lines.push(`- ما يستنزفه: ${a.op_drain || "—"}`);
  lines.push(`- كلماته عن نفسه وكلمات الناس عنه: ${a.op_words || "—"}`);
  lines.push(`- قناعة آذته: ${a.op_belief || "—"}`);
  lines.push("");
  lines.push(`اكتب تقرير الهوية الشخصية لـ${name} بالأقسام التالية وبالترتيب:
## من أنت في سطر
## ماذا تقول بياناتك (ثلاث إلى خمس قراءات، كل قراءة مربوطة برقم أو إجابة)
## قيمك الخمس (اختر خمساً من ترتيبه وإجاباته، ولكل قيمة تعريف سلوكي وإشارة تدل على مخالفتها)
## الرسالة (ثلاث صياغات مقترحة، سطران إلى ثلاثة لكل واحدة، بلا لغة تسويق)
## الحدود (ثلاثة أشياء يرفضها حتى لو جاءت بمال)
## ما يحرسه (لكل دافع سلبي مرتفع ممارسة صغيرة)
## خطة التسعين يوماً (ثلاث عادات بصيغة «أنا شخص، لذلك عندما، سأفعل»، وتجربتان مؤقتتان، وثلاثة معالم)
## ما ينقص لتحسين هذا التقرير (إن وجد)`);
  return lines.join("\n");
}
