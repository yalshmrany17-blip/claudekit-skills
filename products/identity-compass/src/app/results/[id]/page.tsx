import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LocalResults } from "@/components/LocalResults";
import { Paywall } from "@/components/Paywall";
import { ReportView } from "@/components/ReportView";
import { Big5Bars, Gauge, StatusChips } from "@/components/ScoreBars";
import { hasFullAccess } from "@/lib/access";
import { buildReport } from "@/lib/engine/report";
import type { Answers, Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "نتيجتك" };

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "local" || !supabaseConfigured()) return <LocalResults />;

  const user = await currentUser();
  if (!user) redirect(`/login?next=/results/${id}`);

  const supabase = await createClient();
  const { data: a } = await supabase.from("assessments").select("id, answers, result, created_at").eq("id", id).single();
  if (!a) notFound();

  const result = a.result as Result;
  const answers = a.answers as Answers;
  const blocks = buildReport(result, answers, new Date(a.created_at));
  const unlocked = await hasFullAccess(id);
  const name = String(answers.p_name || "").trim();

  return (
    <div className="container-prose py-10 space-y-8">
      <header>
        <p className="text-sm font-semibold text-accent-deep">نتيجتك الأولى{name ? ` · ${name}` : ""}</p>
        <h1 className="display mt-1 text-4xl">أين أنت اليوم</h1>
      </header>
      <Gauge score={result.index.score} band={result.index.band} />
      <StatusChips result={result} />
      <div className="card">
        <h2 className="mb-3 text-lg font-bold">سمات الشخصية</h2>
        <Big5Bars big5={result.big5} />
      </div>

      {unlocked ? (
        <div className="readout flex flex-wrap items-center justify-between gap-3">
          <div className="font-bold">تقريرك الكامل جاهز.</div>
          <Link href={`/report/${id}`} className="btn-primary">افتح التقرير الكامل</Link>
        </div>
      ) : (
        <Paywall assessmentId={id} userId={user.id} email={user.email ?? undefined} />
      )}

      <ReportView blocks={blocks} unlocked={unlocked} />

      {!unlocked ? <Paywall assessmentId={id} userId={user.id} email={user.email ?? undefined} /> : null}
    </div>
  );
}
