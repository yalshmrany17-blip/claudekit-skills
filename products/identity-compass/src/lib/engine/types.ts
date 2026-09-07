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
  /** trait / value key this item feeds */
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
  /** labels for the extremes of a scale, e.g. ["لا ينطبق", "ينطبق تماماً"] */
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

export interface Result {
  version: 1;
  completeness: number; // 0..1 share of scored items answered
  index: { score: number; band: Band };
  signs: { score: number; max: 9; band: Band; flagged: number[] };
  clarity: { score: number; max: 30; band: Band };
  marcia: { status: MarciaStatus; explore: boolean; commit: boolean };
  erikson: { stage: number; name: string; question: string } | null;
  big5: Record<Big5Key, number>; // 0..100
  values: {
    raw: Record<ValueKey, number>; // 1..6
    centered: Record<ValueKey, number>;
    ranked: ValueKey[];
    top3: ValueKey[];
    bottom2: ValueKey[];
    orientations: Record<OrientationKey, number>; // 1..6 mean
    dominant: OrientationKey;
    spread: number; // max-min of centered
  };
  negatives: { total: number; max: 21; scores: Record<NegativeKey, number>; flags: NegativeKey[] };
}
