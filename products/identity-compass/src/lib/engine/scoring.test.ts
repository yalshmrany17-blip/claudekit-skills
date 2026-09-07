import { describe, expect, it } from "vitest";
import { SECTIONS, SCORED_ITEM_IDS } from "./items";
import { bandOf, eriksonStage, marciaStatus, score, scoreBig5, scoreType, scoreValues } from "./scoring";
import { TYPE_PROFILES } from "./types16";
import type { Answers } from "./types";

function fill(overrides: Answers = {}): Answers {
  const a: Answers = { p_age: 27 };
  for (let i = 1; i <= 9; i++) a[`sg_${i}`] = false;
  for (let i = 1; i <= 6; i++) a[`cl_${i}`] = 3;
  a.ms_explore = true;
  a.ms_commit = true;
  for (const s of SECTIONS) {
    for (const it of s.items) {
      if (it.type === "likert5") a[it.id] = 3;
      if (it.type === "likert6") a[it.id] = 4;
      if (it.type === "scale03") a[it.id] = 0;
    }
  }
  return { ...a, ...overrides };
}

describe("item bank", () => {
  it("has 124 scored items and unique ids", () => {
    expect(SCORED_ITEM_IDS.length).toBe(124);
    const all = SECTIONS.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(all).size).toBe(all.length);
  });
  it("big5 has six items per trait with three reversed", () => {
    const b = SECTIONS.find((s) => s.id === "big5")!;
    for (const k of ["O", "C", "E", "A", "N"]) {
      const items = b.items.filter((i) => i.key === k);
      expect(items.length).toBe(6);
      expect(items.filter((i) => i.reverse).length).toBe(3);
    }
  });
  it("types have five items per dichotomy and all 16 profiles exist", () => {
    const t = SECTIONS.find((s) => s.id === "ptypes")!;
    for (const k of ["EI", "SN", "TF", "JP"]) expect(t.items.filter((i) => i.key === k).length).toBe(5);
    expect(Object.keys(TYPE_PROFILES).length).toBe(16);
    for (const p of Object.values(TYPE_PROFILES)) {
      expect(p.strengths.length).toBe(3);
      expect(p.challenges.length).toBe(3);
      expect(p.reflection.length).toBe(2);
    }
  });
});

describe("scoring", () => {
  it("bands", () => {
    expect(bandOf(2, 2, 5)).toBe("low");
    expect(bandOf(3, 2, 5)).toBe("mid");
    expect(bandOf(6, 2, 5)).toBe("high");
  });
  it("marcia", () => {
    expect(marciaStatus(false, false)).toBe("diffusion");
    expect(marciaStatus(false, true)).toBe("foreclosure");
    expect(marciaStatus(true, false)).toBe("moratorium");
    expect(marciaStatus(true, true)).toBe("achievement");
  });
  it("erikson", () => {
    expect(eriksonStage(26)?.stage).toBe(6);
    expect(eriksonStage(45)?.stage).toBe(7);
    expect(eriksonStage(70)?.stage).toBe(8);
    expect(eriksonStage(null)).toBeNull();
  });
  it("neutral answers give mid-range scores and zero-centered values", () => {
    const r = score(fill());
    expect(r.version).toBe(2);
    expect(r.big5.O).toBe(50);
    expect(r.values.spread).toBe(0);
    expect(r.completeness).toBe(1);
    expect(r.negatives.total).toBe(0);
    expect(r.ptype.balanced.length).toBe(4);
    expect(r.strengths.top5.length).toBe(5);
    expect(r.work.autonomy).toBe(50);
  });
  it("reverse coding works", () => {
    const a = fill();
    for (const it of SECTIONS.find((s) => s.id === "big5")!.items) if (it.key === "C") a[it.id] = 5;
    expect(scoreBig5(a).C).toBe(50);
    for (const it of SECTIONS.find((s) => s.id === "big5")!.items) if (it.key === "C") a[it.id] = it.reverse ? 1 : 5;
    expect(scoreBig5(a).C).toBe(100);
  });
  it("type code follows the four dichotomies and flags inconsistency with big five", () => {
    const a = fill();
    for (const it of SECTIONS.find((s) => s.id === "ptypes")!.items) a[it.id] = it.reverse ? 1 : 5; // full E N T J
    const t = scoreType(a, scoreBig5(a));
    expect(t.code).toBe("ENTJ");
    expect(t.name).toBe(TYPE_PROFILES.ENTJ.name);
    expect(t.pct.EI).toBe(100);
    expect(t.balanced.length).toBe(0);
    expect(t.consistency.length).toBeGreaterThan(0); // big five neutral vs extreme type answers
    for (const it of SECTIONS.find((s) => s.id === "ptypes")!.items) a[it.id] = it.reverse ? 5 : 1;
    expect(scoreType(a, scoreBig5(a)).code).toBe("ISFP");
  });
  it("strengths rank the highest items", () => {
    const r = score(fill({ st_honesty_1: 5, st_honesty_2: 5, st_humor_1: 1, st_humor_2: 1 }));
    expect(r.strengths.top5[0]).toBe("honesty");
    expect(r.strengths.bottom3).toContain("humor");
  });
  it("values ranking and orientation", () => {
    const a = fill({ sv_power_1: 6, sv_power_2: 6, sv_achieve_1: 6, sv_achieve_2: 5, sv_trad_1: 1, sv_trad_2: 1 });
    const v = scoreValues(a);
    expect(v.ranked[0]).toBe("power");
    expect(v.ranked[1]).toBe("achieve");
    expect(v.bottom2).toContain("trad");
    expect(v.dominant).toBe("enh");
  });
  it("index rewards clarity and penalizes signs and negatives", () => {
    const strong = score(fill(Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [`cl_${i}`, 5]))));
    const weak = score(
      fill({
        ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [`cl_${i}`, 1])),
        ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((i) => [`sg_${i}`, true])),
        ms_commit: false,
        ng_control: 3,
        ng_admit: 3,
      }),
    );
    expect(strong.index.score).toBeGreaterThan(weak.index.score);
    expect(strong.index.band).toBe("high");
    expect(weak.index.band).toBe("low");
    expect(weak.negatives.flags).toEqual(["control", "admit"]);
    expect(weak.marcia.status).toBe("moratorium");
  });
  it("accepts string answers from forms", () => {
    const r = score(fill({ cl_1: "5", sg_1: "true", ms_commit: "0", p_age: "44" }));
    expect(r.clarity.score).toBe(20);
    expect(r.signs.score).toBe(1);
    expect(r.marcia.commit).toBe(false);
    expect(r.erikson?.stage).toBe(7);
  });
});
