import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";
import { adminClient } from "@/lib/supabase/admin";
import { supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "رأيك بصراحة" };

/** صفحة عامة يفتحها الأشخاص المقربون من رابط التغذية الراجعة. */
export default async function PublicFeedbackPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!supabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <div className="container-prose py-12 max-w-md"><div className="card">الخدمة غير مضبوطة بعد.</div></div>;
  }
  const admin = adminClient();
  const { data: link } = await admin.from("feedback_links").select("assessment_id").eq("token", token).maybeSingle();
  if (!link) return <div className="container-prose py-12 max-w-md"><div className="card">هذا الرابط غير موجود أو انتهى.</div></div>;
  const { data: a } = await admin.from("assessments").select("answers").eq("id", link.assessment_id).single();
  const name = String((a?.answers as { p_name?: string } | null)?.p_name || "").trim();
  return (
    <div className="container-prose py-12 max-w-md">
      <FeedbackForm token={token} name={name} />
    </div>
  );
}
