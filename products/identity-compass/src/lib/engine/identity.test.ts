import { describe, expect, it } from "vitest";
import { composeMission, draftIdentity, emptyProgress, identityFilled, identityToText, planProgressPct, weekOf } from "./identity";
import { SECTIONS } from "./items";
import { buildPlan } from "./report";
import { score } from "./scoring";
import type { Answers } from "./types";

function answers(): Answers {
  const a: Answers = { p_age: 30, p_name: "سارة", op_words: "أنا: صريحة، عملية / الناس: مبدعة، سريعة" };
  for (let i = 1; i <= 9; i++) a[`sg_${i}`] = i < 4;
  for (let i = 1; i <= 6; i++) a[`cl_${i}`] = 3;
  a.ms_explore = true;
  a.ms_commit = false;
  for (const s of SECTIONS) for (const it of s.items) {
    if (it.type === "likert5") a[it.id] = 4;
    if (it.type === "likert6") a[it.id] = 4;
    if (it.type === "scale03") a[it.id] = it.id === "ng_show" ? 3 : 0;
  }
  return a;
}

describe("identity builder", () => {
  it("drafts from results without synthesis", () => {
    const a = answers();
    const r = score(a);
    const d = draftIdentity(r, a, null);
    expect(d.values.length).toBe(5);
    expect(d.values[0].name).toBeTruthy();
    expect(d.boundaries.length).toBeGreaterThanOrEqual(3);
    expect(d.visible.now3).toBe("الناس: مبدعة، سريعة");
    expect(identityFilled(d)).toBeGreaterThan(0);
  });
  it("composes mission and text", () => {
    const m = { role: "مهندسة", who: "الشركات الصغيرة", what: "تنظيم عملياتها", how: "أدوات بسيطة", why: "أعرف كلفة الفوضى", final: "" };
    expect(composeMission(m)).toContain("أنا مهندسة، أساعد الشركات الصغيرة");
    const a = answers();
    const d = draftIdentity(score(a), a, null);
    d.line = "أنا شخص واضح";
    d.mission = m;
    const t = identityToText(d, "سارة");
    expect(t).toContain("# وثيقة الهوية الشخصية · سارة");
    expect(t).toContain("## الرسالة");
  });
  it("tracks plan progress", () => {
    const a = answers();
    const plan = buildPlan(score(a), new Date("2026-09-07T00:00:00Z"));
    expect(weekOf(plan.start, new Date("2026-09-08T12:00:00Z"))).toBe(1);
    expect(weekOf(plan.start, new Date("2026-10-20T12:00:00Z"))).toBe(7);
    const p = emptyProgress();
    expect(planProgressPct(p, plan, 2)).toBe(0);
    p.habits["1_0"] = true;
    p.habits["1_1"] = true;
    p.habits["1_2"] = true;
    p.habits["2_0"] = true;
    expect(planProgressPct(p, plan, 2)).toBe(67);
    p.milestones["30"] = true;
    expect(planProgressPct(p, plan, 5)).toBeGreaterThan(0);
  });
});
