import type { StrengthKey } from "./types16";

export type ItemType =
  | "text"
  | "number"
  | "select"
  | "yesno"
  | "likert5"
  | "likert6"
  | "scale03"
  | "textarea";

export interface Item {
  id: string;
  text: string;
  type: ItemType;
  /** for select */
  options?: string[];
  /** reverse-coded (likert5 only) */
  reverse?: boolean;
  /** trait / value / dichotomy key this item feeds */
  key?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface Section {
  id: string;
  title: string;
  intro: string;
  scored: boolean;
  items: Item[];
  /** labels for the extremes of a scale */
  scaleLabels?: [string, string];
}

export type AnswerValue = string | number | boolean;
export type Answers = Record<string, AnswerValue>;

export type Band = "low" | "mid" | "high";

export type MarciaStatus = "diffusion" | "foreclosure" | "moratorium" | "achievement";

export type Big5Key = "O" | "C" | "E" | "A" | "N";

export type ValueKey =
  | "power"
  | "achieve"
  | "hedon"
  | "stim"
  | "selfdir"
  | "univ"
  | "benev"
  | "trad"
  | "conf"
  | "secur";

export type OrientationKey = "open" | "enh" | "cons" | "trans";

export type NegativeKey = "show" | "polish" | "drift" | "money" | "control" | "vague" | "admit";

export interface TypeResult {
  /** four-letter code, e.g. ENTP */
  code: string;
  name: string;
  /** percent toward the positive pole per dichotomy: E, N, T, J */
  pct: { EI: number; SN: number; TF: number; JP: number };
  /** dichotomies where the preference is within 45..55 */
  balanced: ("EI" | "SN" | "TF" | "JP")[];
  /** notes where Big Five disagrees with the type answers */
  consistency: string[];
}

export interface Result {
  version: 2;
  completeness: number;
  index: { score: number; band: Band };
  signs: { score: number; max: 9; band: Band; flagged: number[] };
  clarity: { score: number; max: 30; band: Band };
  marcia: { status: MarciaStatus; explore: boolean; commit: boolean };
  erikson: { stage: number; name: string; question: string } | null;
  big5: Record<Big5Key, number>;
  ptype: TypeResult;
  strengths: { scores: Record<StrengthKey, number>; top5: StrengthKey[]; bottom3: StrengthKey[] };
  work: Record<string, number>;
  values: {
    raw: Record<ValueKey, number>;
    centered: Record<ValueKey, number>;
    ranked: ValueKey[];
    top3: ValueKey[];
    bottom2: ValueKey[];
    orientations: Record<OrientationKey, number>;
    dominant: OrientationKey;
    spread: number;
  };
  negatives: { total: number; max: 21; scores: Record<NegativeKey, number>; flags: NegativeKey[] };
}
