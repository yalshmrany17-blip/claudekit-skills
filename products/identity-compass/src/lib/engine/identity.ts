import { NEGATIVE_PRACTICES, VALUE_DESCRIPTIONS, VALUE_NAMES } from "./items";
import type { Plan } from "./report";
import type { Synthesis } from "./synthesis";
import { STRENGTHS, TYPE_PROFILES } from "./types16";
import type { Answers, Result } from "./types";

/** وثيقة الهوية التي يكتبها الشخص بنفسه في مرحلة البناء */
export interface IdentityDoc {
  line: string;
  values: { name: string; means: string; broke: string }[];
  mission: { role: string; who: string; what: string; how: string; why: string; final: string };
  positioning: { for: string; what: string; unlike: string; because: string };
  pillars: string[];
  visible: { tone: string; dress: string; colors: string; signature: string; now3: string; goal3: string; bio: string };
  boundaries: string[];
  updatedAt?: number;
}

export function emptyIdentity(): IdentityDoc {
  return {
    line: "",
    values: Array.from({ length: 5 }, () => ({ name: "", means: "", broke: "" })),
    mission: { role: "", who: "", what: "", how: "", why: "", final: "" },
    positioning: { for: "", what: "", unlike: "", because: "" },
    pillars: ["", "", ""],
    visible: { tone: "", dress: "", colors: "", signature: "", now3: "", goal3: "", bio: "" },
    boundaries: ["", "", ""],
  };
}

/** اقتراحات البداية: تُملأ من النتائج وقراءة الشركة إن وُجدت، ويعدّلها الشخص بحرية */
export function draftIdentity(r: Result, a: Answers, s?: Synthesis | null): IdentityDoc {
  const d = emptyIdentity();
  const tp = TYPE_PROFILES[r.ptype.code];
  if (s) {
    d.line = s.one_liner || "";
    d.values = (s.values || []).slice(0, 5).map((v) => ({ name: v.name, means: v.means, broke: v.broke_when }));
    while (d.values.length < 5) d.values.push({ name: "", means: "", broke: "" });
    d.mission.final = s.mission_options?.[0] || "";
    d.boundaries = (s.boundaries || []).slice(0, 4);
    while (d.boundaries.length < 3) d.boundaries.push("");
    d.positioning.for = s.career?.fit?.[0] ? "" : "";
  } else {
    d.values = r.values.top3.map((k) => ({ name: VALUE_NAMES[k], means: "", broke: "" })).concat([{ name: "", means: "", broke: "" }, { name: "", means: "", broke: "" }]);
    d.boundaries = r.negatives.flags.slice(0, 3).map((k) => NEGATIVE_PRACTICES[k].split("»:")[0].replace("«", "").trim());
    while (d.boundaries.length < 3) d.boundaries.push("");
  }
  d.visible.now3 = String(a.op_words || "").split("/")[1]?.trim() || "";
  d.visible.tone = r.ptype.pct.EI >= 50 ? (r.ptype.pct.TF >= 50 ? "مباشر وواضح" : "ودود وقريب") : r.ptype.pct.TF >= 50 ? "هادئ ودقيق" : "هادئ ودافئ";
  d.mission.who = "";
  d.pillars = tp.career.fit.slice(0, 3).map(() => "");
  return d;
}

export function composeMission(m: IdentityDoc["mission"]) {
  const parts = [m.role && `أنا ${m.role}`, m.who && `أساعد ${m.who}`, m.what && `على ${m.what}`, m.how && `من خلال ${m.how}`, m.why && `لأن ${m.why}`].filter(Boolean);
  return parts.length ? parts.join("، ") + "." : "";
}

export function identityFilled(d: IdentityDoc): number {
  const fields: string[] = [
    d.line,
    ...d.values.flatMap((v) => [v.name, v.means, v.broke]),
    d.mission.final,
    d.positioning.for,
    d.positioning.what,
    d.positioning.unlike,
    d.positioning.because,
    ...d.pillars,
    d.visible.tone,
    d.visible.dress,
    d.visible.colors,
    d.visible.signature,
    d.visible.now3,
    d.visible.goal3,
    d.visible.bio,
    ...d.boundaries,
  ];
  const n = fields.filter((f) => f && f.trim()).length;
  return Math.round((n / fields.length) * 100);
}

export function identityToText(d: IdentityDoc, name?: string): string {
  const L: string[] = [];
  L.push(`# وثيقة الهوية الشخصية${name ? " · " + name : ""}`);
  if (d.line) L.push("", d.line);
  const vals = d.values.filter((v) => v.name);
  if (vals.length) L.push("", "## القيم", ...vals.map((v) => `- ${v.name}${v.means ? ": " + v.means : ""}${v.broke ? " (أعرف أنني خالفتها عندما " + v.broke + ")" : ""}`));
  const m = d.mission.final || composeMission(d.mission);
  if (m) L.push("", "## الرسالة", m);
  const p = d.positioning;
  if (p.for || p.what) L.push("", "## التموضع", [p.for && `لـ ${p.for}`, p.what && `أقدم ${p.what}`, p.unlike && `على عكس ${p.unlike}`, p.because && `لأنني ${p.because}`].filter(Boolean).join("، ") + ".");
  const pil = d.pillars.filter(Boolean);
  if (pil.length) L.push("", "## الركائز", ...pil.map((x) => `- ${x}`));
  const v = d.visible;
  const vis = [v.tone && `النبرة: ${v.tone}`, v.dress && `اللبس: ${v.dress}`, v.colors && `الألوان: ${v.colors}`, v.signature && `العلامة المميزة: ${v.signature}`].filter(Boolean);
  if (vis.length || v.now3 || v.goal3) L.push("", "## الهوية الظاهرة", ...vis.map((x) => `- ${x}`), v.now3 || v.goal3 ? `- الكلمات: اليوم «${v.now3 || "—"}» → بعد سنة «${v.goal3 || "—"}»` : "");
  if (v.bio) L.push("", "## النبذة", v.bio);
  const b = d.boundaries.filter(Boolean);
  if (b.length) L.push("", "## الحدود", ...b.map((x) => `- لا ${x.replace(/^لا\s+/, "")}`));
  return L.filter((x) => x !== undefined).join("\n");
}

/** اقتراحات جاهزة لكل خطوة في البناء */
export function builderHints(r: Result, a: Answers, s?: Synthesis | null) {
  const tp = TYPE_PROFILES[r.ptype.code];
  return {
    values: r.values.ranked.slice(0, 6).map((k) => ({ name: VALUE_NAMES[k], desc: VALUE_DESCRIPTIONS[k] })),
    aiValues: s?.values ?? [],
    strengths: r.strengths.top5.map((k) => STRENGTHS[k].name),
    missionOptions: s?.mission_options ?? [],
    asked: String(a.op_asked || ""),
    hoped: String(a.op_hoped || ""),
    careerFit: s?.career?.fit?.length ? s.career.fit : tp.career.fit,
    careerAvoid: s?.career?.avoid?.length ? s.career.avoid : tp.career.avoid,
    boundaries: s?.boundaries ?? r.negatives.flags.map((k) => NEGATIVE_PRACTICES[k]),
    words: String(a.op_words || ""),
    typeName: r.ptype.name,
    oneLiner: s?.one_liner ?? "",
  };
}

/** تقدم خطة التسعين يوماً */
export interface PlanProgress {
  /** مفتاح `${week}_${habitIndex}` → التزم أغلب أيام الأسبوع */
  habits: Record<string, boolean>;
  /** مفتاح day (30/60/90) → أُنجز */
  milestones: Record<string, boolean>;
  /** مفتاح week → تأمل الأسبوع */
  notes: Record<string, string>;
  updatedAt?: number;
}

export const PLAN_WEEKS = 13;

export function emptyProgress(): PlanProgress {
  return { habits: {}, milestones: {}, notes: {} };
}

export function planProgressPct(p: PlanProgress, plan: Plan, weekNow: number) {
  const weeks = Math.min(PLAN_WEEKS, Math.max(0, weekNow));
  const habitSlots = weeks * plan.habits.length;
  const habitDone = Object.entries(p.habits).filter(([k, v]) => v && Number(k.split("_")[0]) <= weeks).length;
  const msDue = plan.milestones.filter((m) => m.day <= weeks * 7).length;
  const msDone = plan.milestones.filter((m) => m.day <= weeks * 7 && p.milestones[String(m.day)]).length;
  const total = habitSlots + msDue;
  return total ? Math.round(((habitDone + msDone) / total) * 100) : 0;
}

export function weekOf(startIso: string, now: Date = new Date()) {
  const start = new Date(startIso + "T00:00:00Z").getTime();
  const days = Math.floor((now.getTime() - start) / 86400000);
  return Math.max(0, Math.min(PLAN_WEEKS, Math.floor(days / 7) + 1));
}
