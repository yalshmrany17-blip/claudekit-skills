import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { IdentityBuilder } from "@/components/IdentityBuilder";
import { LocalBuilder } from "@/components/LocalBuilder";
import { hasFullAccess } from "@/lib/access";
import type { FeedbackSummary, IdentityReview } from "@/lib/engine/feedback";
import { draftIdentity, type IdentityDoc } from "@/lib/engine/identity";
import type { Synthesis } from "@/lib/engine/synthesis";
import type { Answers, Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "اصنع هويتك" };

export default async function BuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "local" || !supabaseConfigured()) return <LocalBuilder />;

  const user = await currentUser();
  if (!user) redirect(`/login?next=/build/${id}`);

  const supabase = await createClient();
  const { data: a } = await supabase.from("assessments").select("id, answers, result").eq("id", id).single();
  if (!a) notFound();
  if (!(await hasFullAccess(id))) redirect(`/results/${id}`);

  const [{ data: rep }, { data: ident }, { data: link }] = await Promise.all([
    supabase.from("reports").select("synthesis").eq("assessment_id", id).maybeSingle(),
    supabase.from("identities").select("doc, review").eq("assessment_id", id).maybeSingle(),
    supabase.from("feedback_links").select("summary").eq("assessment_id", id).maybeSingle(),
  ]);
  const result = a.result as Result;
  const answers = a.answers as Answers;
  const synthesis = (rep?.synthesis as Synthesis | null) ?? null;
  const initial = (ident?.doc as IdentityDoc | null) ?? draftIdentity(result, answers, synthesis);
  const name = String(answers.p_name || "").trim();

  return <IdentityBuilder assessmentId={id} userId={user.id} result={result} answers={answers} synthesis={synthesis} initial={initial} name={name} review={(ident?.review as IdentityReview | null) ?? null} feedback={(link?.summary as FeedbackSummary | null) ?? null} />;
}
