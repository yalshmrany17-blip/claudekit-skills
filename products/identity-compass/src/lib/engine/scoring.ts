import { ERIKSON_STAGES, ORIENTATION_MEMBERS, SECTIONS, SCORED_ITEM_IDS } from "./items";
import { STRENGTH_KEYS, TYPE_PROFILES, WORK_ITEMS, type StrengthKey } from "./types16";
import type {
  Answers,
  Band,
  Big5Key,
  MarciaStatus,
  NegativeKey,
  OrientationKey,
  Result,
  TypeResult,
  ValueKey,
} from "./types";

const BIG5_KEYS: Big5Key[] = ["O", "C", "E", "A", "N"];
const VALUE_KEYS: ValueKey[] = ["power", "achieve", "hedon", "stim", "selfdir", "univ", "benev", "trad", "conf", "secur"];
const NEG_KEYS: NegativeKey[] = ["show", "polish", "drift", "money", "control", "vague", "admit"];

function num(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function truthy(v: unknown): boolean {
  return v === true || v === 1 || v === "1" || v === "true" || v === "نعم";
}

const round = (x: number) => Math.round(x);
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function bandOf(value: number, lowMax: number, midMax: number): Band {
  if (value <= lowMax) return "low";
  if (value <= midMax) return "mid";
  return "high";
}

export function eriksonStage(age: number | null) {
  if (age === null || age < 0) return null;
  const idx = ERIKSON_STAGES.findIndex((s) => age < s.maxAge);
  const i = idx === -1 ? ERIKSON_STAGES.length - 1 : idx;
  const st = ERIKSON_STAGES[i];
  return { stage: i + 1, name: st.name, question: st.question };
}

export function marciaStatus(explore: boolean, commit: boolean): MarciaStatus {
  if (explore && commit) return "achievement";
  if (explore) return "moratorium";
  if (commit) return "foreclosure";
  return "diffusion";
}

/** mean of 1..5 likert items for a key in a section (reverse-coded where marked), mapped to 0..100 */
function likertPct(sectionId: string, key: string, answers: Answers, fallback = 50): number {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return fallback;
  const vals: number[] = [];
  for (const it of section.items) {
    if (it.key !== key) continue;
    const v = num(answers[it.id]);
    if (v === null) continue;
    vals.push(it.reverse ? 6 - v : v);
  }
  return vals.length ? round(((mean(vals) - 1) / 4) * 100) : fallback;
}

/** Big Five: six items per trait → 0..100 */
export function scoreBig5(answers: Answers): Record<Big5Key, number> {
  const out = {} as Record<Big5Key, number>;
  for (const k of BIG5_KEYS) out[k] = likertPct("big5", k, answers);
  return out;
}

/** Four dichotomies → percent toward E/N/T/J, letters, and consistency notes against Big Five. */
export function scoreType(answers: Answers, big5: Record<Big5Key, number>): TypeResult {
  const pct = {
    EI: likertPct("ptypes", "EI", answers),
    SN: likertPct("ptypes", "SN", answers),
    TF: likertPct("ptypes", "TF", answers),
    JP: likertPct("ptypes", "JP", answers),
  };
  const code = (pct.EI >= 50 ? "E" : "I") + (pct.SN >= 50 ? "N" : "S") + (pct.TF >= 50 ? "T" : "F") + (pct.JP >= 50 ? "J" : "P");
  const balanced = (Object.keys(pct) as (keyof typeof pct)[]).filter((k) => pct[k] >= 45 && pct[k] <= 55);
  const consistency: string[] = [];
  const gap = 30;
  if (Math.abs(pct.EI - big5.E) > gap) consistency.push("إجاباتك عن الطاقة في قسم النمط تختلف عن مقياس الانبساط في سمات الشخصية؛ الأرجح أنك تتصرف اجتماعياً بطريقة تختلف عما يريحك فعلاً.");
  if (Math.abs(pct.SN - big5.O) > gap) consistency.push("إجاباتك عن الانتباه تختلف عن مقياس الانفتاح على التجربة؛ قد تحب الأفكار الجديدة في الحديث وتفضّل المجرب في القرار.");
  if (Math.abs(100 - pct.TF - big5.A) > gap) consistency.push("إجاباتك عن القرار تختلف عن مقياس التوافق؛ قد تقرر بالمنطق وتنفذ بما يرضي الناس، أو العكس.");
  if (Math.abs(pct.JP - big5.C) > gap) consistency.push("إجاباتك عن الأسلوب تختلف عن مقياس الانضباط؛ قد تحب الخطط ولا تلتزم بها، أو تلتزم بلا خطة مكتوبة.");
  return { code, name: TYPE_PROFILES[code]?.name ?? code, pct, balanced, consistency };
}

export function scoreStrengths(answers: Answers): Result["strengths"] {
  const scores = {} as Record<StrengthKey, number>;
  for (const k of STRENGTH_KEYS) scores[k] = likertPct("strengths", k, answers);
  const ranked = [...STRENGTH_KEYS].sort((a, b) => scores[b] - scores[a] || STRENGTH_KEYS.indexOf(a) - STRENGTH_KEYS.indexOf(b));
  return { scores, top5: ranked.slice(0, 5), bottom3: ranked.slice(-3) };
}

export function scoreWork(answers: Answers): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of WORK_ITEMS) {
    const v = num(answers[`wk_${w.key}`]);
    out[w.key] = v === null ? 50 : round(((v - 1) / 4) * 100);
  }
  return out;
}

/** Schwartz values: mean of two 1..6 portraits per value, centered on the person's own mean. */
export function scoreValues(answers: Answers): Result["values"] {
  const section = SECTIONS.find((s) => s.id === "values")!;
  const raw = {} as Record<ValueKey, number>;
  for (const k of VALUE_KEYS) {
    const vals: number[] = [];
    for (const it of section.items) {
      if (it.key !== k) continue;
      const v = num(answers[it.id]);
      if (v !== null) vals.push(v);
    }
    raw[k] = vals.length ? mean(vals) : 3.5;
  }
  const overall = mean(VALUE_KEYS.map((k) => raw[k]));
  const centered = {} as Record<ValueKey, number>;
  for (const k of VALUE_KEYS) centered[k] = +(raw[k] - overall).toFixed(2);
  const ranked = [...VALUE_KEYS].sort((a, b) => centered[b] - centered[a] || raw[b] - raw[a] || VALUE_KEYS.indexOf(a) - VALUE_KEYS.indexOf(b));
  const orientations = {} as Record<OrientationKey, number>;
  (Object.keys(ORIENTATION_MEMBERS) as OrientationKey[]).forEach((o) => {
    orientations[o] = +mean(ORIENTATION_MEMBERS[o].map((k) => raw[k])).toFixed(2);
  });
  const dominant = (Object.keys(orientations) as OrientationKey[]).sort((a, b) => orientations[b] - orientations[a])[0];
  const cs = VALUE_KEYS.map((k) => centered[k]);
  const spread = +(Math.max(...cs) - Math.min(...cs)).toFixed(2);
  return { raw, centered, ranked, top3: ranked.slice(0, 3), bottom2: ranked.slice(-2), orientations, dominant, spread };
}

export function scoreNegatives(answers: Answers): Result["negatives"] {
  const scores = {} as Record<NegativeKey, number>;
  let total = 0;
  const flags: NegativeKey[] = [];
  for (const k of NEG_KEYS) {
    const v = num(answers[`ng_${k}`]) ?? 0;
    scores[k] = v;
    total += v;
    if (v >= 2) flags.push(k);
  }
  return { total, max: 21, scores, flags };
}

export function completeness(answers: Answers): number {
  let answered = 0;
  for (const id of SCORED_ITEM_IDS) {
    const v = answers[id];
    if (v !== undefined && v !== null && v !== "") answered++;
  }
  return SCORED_ITEM_IDS.length ? +(answered / SCORED_ITEM_IDS.length).toFixed(3) : 0;
}

export function score(answers: Answers): Result {
  const flagged: number[] = [];
  for (let i = 1; i <= 9; i++) if (truthy(answers[`sg_${i}`])) flagged.push(i);
  const signsScore = flagged.length;

  let clarity = 0;
  for (let i = 1; i <= 6; i++) clarity += num(answers[`cl_${i}`]) ?? 3;

  const explore = truthy(answers.ms_explore);
  const commit = truthy(answers.ms_commit);
  const status = marciaStatus(explore, commit);

  const big5 = scoreBig5(answers);
  const ptype = scoreType(answers, big5);
  const strengths = scoreStrengths(answers);
  const work = scoreWork(answers);
  const values = scoreValues(answers);
  const negatives = scoreNegatives(answers);
  const erikson = eriksonStage(num(answers.p_age));

  const clarityPct = (clarity - 6) / 24;
  const signsPct = 1 - signsScore / 9;
  const commitPct = commit ? 1 : explore ? 0.5 : 0.25;
  const negPct = 1 - negatives.total / 21;
  const index = round(100 * (0.4 * clarityPct + 0.3 * signsPct + 0.15 * commitPct + 0.15 * negPct));

  return {
    version: 2,
    completeness: completeness(answers),
    index: { score: index, band: bandOf(index, 44, 69) },
    signs: { score: signsScore, max: 9, band: bandOf(signsScore, 2, 5), flagged },
    clarity: { score: clarity, max: 30, band: clarity >= 24 ? "high" : clarity >= 15 ? "mid" : "low" },
    marcia: { status, explore, commit },
    erikson,
    big5,
    ptype,
    strengths,
    work,
    values,
    negatives,
  };
}
