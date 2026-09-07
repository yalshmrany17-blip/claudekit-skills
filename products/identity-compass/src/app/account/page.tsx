import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { INDEX_LABEL } from "@/lib/engine/report";
import type { Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = { title: "حسابي" };

export default async function AccountPage() {
  if (!supabaseConfigured()) redirect("/");
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");

  const supabase = await createClient();
  const { data: rows } = await supabase.from("assessments").select("id, result, created_at").order("created_at", { ascending: false });
  const { data: purchases } = await supabase.from("purchases").select("assessment_id").eq("status", "paid");
  const paidSet = new Set((purchases ?? []).map((p) => p.assessment_id));

  return (
    <div className="container-prose py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-4xl">حسابي</h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      {!rows?.length ? (
        <div className="card">
          <p>لا توجد تقييمات بعد.</p>
          <Link href="/test" className="btn-primary mt-4">ابدأ التقييم</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const res = r.result as Result;
            const paid = paidSet.has(r.id);
            return (
              <li key={r.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{new Date(r.created_at).toISOString().slice(0, 10)} · المؤشر {res.index.score} · {INDEX_LABEL[res.index.band]}</div>
                  <div className="text-sm text-muted">{paid ? "التقرير الكامل مفتوح" : "النتيجة الأولى فقط"}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/results/${r.id}`} className="btn">النتيجة</Link>
                  {paid ? <Link href={`/report/${r.id}`} className="btn-primary">التقرير</Link> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/test" className="btn">تقييم جديد</Link>
    </div>
  );
}
