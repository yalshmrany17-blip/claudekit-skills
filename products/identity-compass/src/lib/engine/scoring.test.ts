import { describe, expect, it } from "vitest";
import { SECTIONS, SCORED_ITEM_IDS } from "./items";
import { bandOf, eriksonStage, marciaStatus, score, scoreBig5, scoreValues } from "./scoring";
import type { Answers } from "./types";

function fill(overrides: Answers = {}): Answers {
  const a: Answers = { p_age: 27 };
  for (let i = 1; i <= 9; i++) a[`sg_${i}`] = false;
  for (let i = 1; i <= 6; i++) a[`cl_${i}`] = 3;
  a.ms_explore = true;
  a.ms_commit = true;
  for (const s of SECTIONS) {
    for (const it of s.items) {
      if (it.type === "likert5" && it.id.startsWith("b5_")) a[it.id] = 3;
      if (it.type === "likert6") a[it.id] = 4;
      if (it.type === "scale03") a[it.id] = 0;
    }
  }
  return { ...a, ...overrides };
}

describe("item bank", () => {
  it("has 74 scored items and unique ids", () => {
    expect(SCORED_ITEM_IDS.length).toBe(74);
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
  it("neutral answers give mid-range big5 and zero-centered values", () => {
    const r = score(fill());
    expect(r.big5.O).toBe(50);
    expect(r.big5.C).toBe(50);
    expect(r.values.spread).toBe(0);
    expect(r.completeness).toBe(1);
    expect(r.negatives.total).toBe(0);
  });
  it("reverse coding works", () => {
    const a = fill();
    // all conscientiousness items answered 5: positives push up, reversed push down
    for (const it of SECTIONS.find((s) => s.id === "big5")!.items) if (it.key === "C") a[it.id] = 5;
    const b5 = scoreBig5(a);
    expect(b5.C).toBe(50); // 3 items at 100 + 3 reversed at 0
    for (const it of SECTIONS.find((s) => s.id === "big5")!.items) if (it.key === "C") a[it.id] = it.reverse ? 1 : 5;
    expect(scoreBig5(a).C).toBe(100);
  });
  it("values ranking and orientation", () => {
    const a = fill({ sv_power_1: 6, sv_power_2: 6, sv_achieve_1: 6, sv_achieve_2: 5, sv_trad_1: 1, sv_trad_2: 1 });
    const v = scoreValues(a);
    expect(v.ranked[0]).toBe("power");
    expect(v.ranked[1]).toBe("achieve");
    expect(v.bottom2).toContain("trad");
    expect(v.dominant).toBe("enh");
    expect(v.spread).toBeGreaterThan(0);
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
    expect(weak.signs.band).toBe("high");
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
