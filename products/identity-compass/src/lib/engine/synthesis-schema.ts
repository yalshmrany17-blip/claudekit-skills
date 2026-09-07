import { z } from "zod";

/** مخطط المخرجات المنظمة لـ Claude. يُبقى منفصلاً عن المحرك حتى لا يدخل zod في حزمة المتصفح. */
export const SynthesisSchema = z.object({
  one_liner: z.string().describe("من هو في سطر واحد"),
  thesis: z.string().describe("مبدأ الهوية في جملة قصيرة"),
  findings: z.array(z.object({ title: z.string(), body: z.string(), evidence: z.string() })).describe("ثلاث إلى ست قراءات، كل واحدة بدليل"),
  values: z.array(z.object({ name: z.string(), means: z.string(), broke_when: z.string() })).describe("خمس قيم بالضبط"),
  mission_options: z.array(z.string()).describe("ثلاث صياغات للرسالة"),
  boundaries: z.array(z.string()).describe("ثلاثة إلى أربعة حدود"),
  guards: z.array(z.object({ drive: z.string(), practice: z.string() })).describe("لكل دافع سلبي مرتفع ممارسة"),
  career: z.object({ fit: z.array(z.string()), avoid: z.array(z.string()), next_role: z.string() }),
  relationships: z.string(),
  plan: z.object({
    habits: z.array(z.object({ identity: z.string(), when: z.string(), action: z.string() })).describe("ثلاث عادات"),
    experiments: z.array(z.object({ what: z.string(), days: z.number(), learn: z.string() })).describe("تجربتان"),
    milestones: z.array(z.object({ day: z.number(), title: z.string(), measure: z.string() })).describe("الأيام 30 و60 و90"),
    weekly_rhythm: z.array(z.string()).describe("ثلاثة إلى خمسة بنود"),
  }),
  reflection_prompts: z.array(z.string()).describe("خمسة إلى ثمانية أسئلة"),
  missing: z.array(z.string()).describe("ما ينقص لتحسين التقرير"),
});

export type SynthesisOutput = z.infer<typeof SynthesisSchema>;
