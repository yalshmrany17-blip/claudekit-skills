import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PendingPayment } from "@/components/PendingPayment";
import { PlanCalendar } from "@/components/PlanCalendar";
import { PrintButton } from "@/components/PrintButton";
import { ReportView } from "@/components/ReportView";
import { Big5Bars, Gauge, StatusChips, StrengthBars, TypeCard, ValueBars } from "@/components/ScoreBars";
import { SynthesisView } from "@/components/SynthesisView";
import { hasFullAccess } from "@/lib/access";
import { buildPlan, buildReport, identityThesis } from "@/lib/engine/report";
import type { Synthesis } from "@/lib/engine/synthesis";
import type { Answers, Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "التقرير الكامل" };

export default async function ReportPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string }> }) {
  const { id } = await params;
  const { paid } = await searchParams;
  if (!supabaseConfigured()) redirect("/results/local");

  const user = await currentUser();
  if (!user) redirect(`/login?next=/report/${id}`);

  const supabase = await createClient();
  const { data: a } = await supabase.from("assessments").select("id, answers, result, created_at").eq("id", id).single();
  if (!a) notFound();

  const unlocked = await hasFullAccess(id);
  if (!unlocked) return <PendingPayment assessmentId={id} paid={paid === "1"} />;

  const { data: rep } = await supabase.from("reports").select("synthesis").eq("assessment_id", id).maybeSingle();
  const synthesis = (rep?.synthesis as Synthesis | null) ?? null;

  const result = a.result as Result;
  const answers = a.answers as Answers;
  const created = new Date(a.created_at);
  const blocks = buildReport(result, answers, created);
  const plan = buildPlan(result, created);
  const name = String(answers.p_name || "").trim();
  const thesis = identityThesis(result);
  const date = created.toISOString().slice(0, 10);

  return (
    <div className="container-prose py-10 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-deep">تقرير الهوية الشخصية · {date}</p>
          <h1 className="display mt-1 text-5xl">{name || "تقريرك"}</h1>
          <p className="display mt-2 text-2xl text-accent-deep">«{synthesis?.thesis || thesis.line}»</p>
        </div>
        <PrintButton />
      </header>

      <Gauge score={result.index.score} band={result.index.band} />
      <StatusChips result={result} />
      <div className="grid gap-5 md:grid-cols-2">
        <TypeCard ptype={result.ptype} />
        <div className="space-y-5">
          <div className="card"><h2 className="mb-3 text-lg font-bold">سمات الشخصية</h2><Big5Bars big5={result.big5} /></div>
          <div className="card"><h2 className="mb-3 text-lg font-bold">قواك المميزة</h2><StrengthBars strengths={result.strengths} /></div>
        </div>
      </div>
      <div className="card"><h2 className="mb-3 text-lg font-bold">قيمك مرتبة</h2><ValueBars values={result.values} /></div>

      <SynthesisView assessmentId={id} existing={synthesis} />

      <PlanCalendar plan={plan} ai={synthesis?.plan ?? null} />

      <ReportView blocks={blocks} unlocked />

      <p className="text-sm text-muted">هذا تقييم تطويري لا علاجي. النسب تعبّر عن موقعك على المقياس لا عن مقارنة بعينة سكانية. أعد التقييم بعد ستة أشهر وقارن.</p>
    </div>
  );
}
