import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FeedbackOwner } from "@/components/FeedbackOwner";
import { hasFullAccess } from "@/lib/access";
import type { FeedbackResponse, FeedbackSummary } from "@/lib/engine/feedback";
import { SITE } from "@/lib/site";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "رسالة العشرة أشخاص" };

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabaseConfigured()) redirect("/");
  const user = await currentUser();
  if (!user) redirect(`/login?next=/feedback/${id}`);

  const supabase = await createClient();
  const { data: a } = await supabase.from("assessments").select("id, answers").eq("id", id).single();
  if (!a) notFound();
  if (!(await hasFullAccess(id))) redirect(`/results/${id}`);

  const { data: link } = await supabase.from("feedback_links").select("token, summary").eq("assessment_id", id).maybeSingle();
  const { data: rows } = link
    ? await supabase.from("feedback_responses").select("relation, keep, change, best, created_at").eq("token", link.token).order("created_at")
    : { data: [] as FeedbackResponse[] };

  return (
    <FeedbackOwner
      assessmentId={id}
      token={link?.token ?? null}
      responses={(rows ?? []) as FeedbackResponse[]}
      summary={(link?.summary as FeedbackSummary | null) ?? null}
      name={String((a.answers as { p_name?: string }).p_name || "").trim()}
      siteUrl={SITE.url}
    />
  );
}
