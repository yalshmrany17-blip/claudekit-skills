import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LocalPlan } from "@/components/LocalPlan";
import { PlanTracker } from "@/components/PlanTracker";
import { hasFullAccess } from "@/lib/access";
import { emptyProgress, type PlanProgress } from "@/lib/engine/identity";
import { buildPlan, buildReport } from "@/lib/engine/report";
import type { Synthesis } from "@/lib/engine/synthesis";
import type { Answers, Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "خطة التسعين يوماً" };

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "local" || !supabaseConfigured()) return <LocalPlan />;

  const user = await currentUser();
  if (!user) redirect(`/login?next=/plan/${id}`);

  const supabase = await createClient();
  const { data: a } = await supabase.from("assessments").select("id, answers, result, created_at").eq("id", id).single();
  if (!a) notFound();
  if (!(await hasFullAccess(id))) redirect(`/results/${id}`);

  const [{ data: rep }, { data: prog }] = await Promise.all([
    supabase.from("reports").select("synthesis").eq("assessment_id", id).maybeSingle(),
    supabase.from("plan_progress").select("data").eq("assessment_id", id).maybeSingle(),
  ]);
  const result = a.result as Result;
  const answers = a.answers as Answers;
  const created = new Date(a.created_at);
  const synthesis = (rep?.synthesis as Synthesis | null) ?? null;
  const base = buildPlan(result, created);
  const plan = synthesis?.plan
    ? {
        ...base,
        habits: synthesis.plan.habits?.length ? synthesis.plan.habits : base.habits,
        experiments: synthesis.plan.experiments?.length ? synthesis.plan.experiments : base.experiments,
        milestones: synthesis.plan.milestones?.length ? synthesis.plan.milestones.map((m) => ({ ...m, date: base.milestones.find((b) => b.day === m.day)?.date ?? base.milestones[2].date })) : base.milestones,
        weekly: synthesis.plan.weekly_rhythm?.length ? synthesis.plan.weekly_rhythm : base.weekly,
      }
    : base;
  const prompts = synthesis?.reflection_prompts?.length ? synthesis.reflection_prompts : (buildReport(result, answers, created).find((b) => b.id === "reflection")?.bullets ?? []);
  const initial = (prog?.data as PlanProgress | null) ?? emptyProgress();

  return <PlanTracker assessmentId={id} userId={user.id} plan={plan} prompts={prompts} initial={initial} name={String(answers.p_name || "").trim()} />;
}
