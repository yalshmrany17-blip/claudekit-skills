import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { INDEX_LABEL } from "@/lib/engine/report";
import type { Result } from "@/lib/engine/types";
import { createClient, currentUser, supabaseConfigured } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";
import { FREE_MODE } from "@/lib/access";

export const metadata: Metadata = { title: "حسابي" };

export default async function AccountPage() {
  if (!supabaseConfigured()) redirect("/");
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");

  const supabase = await createClient();
  const { data: rows } = await supabase.from("assessments").select("id, result, created_at").order("created_at", { ascending: false });
  const { data: purchases } = await supabase.from("purchases").select("assessment_id").eq("status", "paid");
  const paidSet = new Set((purchases ?? []).map((p) => p.assessment_id));
  const freeAll = FREE_MODE;

  return (
    <div className="container-prose py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-4xl">حسابي</h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <SignOutButton />
      </header>

      {rows && rows.length >= 2 ? (() => {
        const latest = rows[0].result as Result;
        const prev = rows[1].result as Result;
        const d = (x: number, y: number) => (x - y >= 0 ? `+${x - y}` : `${x - y}`);
        return (
          <div className="readout">
            <div className="font-bold">التغير منذ التقييم السابق ({new Date(rows[1].created_at).toISOString().slice(0, 10)})</div>
            <div className="mt-1 flex flex-wrap gap-4 text-sm">
              <span>مؤشر الوضوح: {latest.index.score} ({d(latest.index.score, prev.index.score)})</span>
              <span>وضوح الذات: {latest.clarity.score} ({d(latest.clarity.score, prev.clarity.score)})</span>
              <span>علامات الخلل: {latest.signs.score} ({d(latest.signs.score, prev.signs.score)})</span>
              <span>الدوافع السلبية: {latest.negatives.total} ({d(latest.negatives.total, prev.negatives.total)})</span>
            </div>
          </div>
        );
      })() : null}

      {!rows?.length ? (
        <div className="card">
          <p>لا توجد تقييمات بعد.</p>
          <Link href="/test" className="btn-primary mt-4">ابدأ التقييم</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const res = r.result as Result;
            const paid = freeAll || paidSet.has(r.id);
            return (
              <li key={r.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{new Date(r.created_at).toISOString().slice(0, 10)} · المؤشر {res.index.score} · {INDEX_LABEL[res.index.band]}</div>
                  <div className="text-sm text-muted">{paid ? "التقرير الكامل مفتوح" : "النتيجة الأولى فقط"}</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/results/${r.id}`} className="btn">النتيجة</Link>
                  {paid ? <Link href={`/report/${r.id}`} className="btn-primary">التقرير</Link> : null}
                  {paid ? <Link href={`/build/${r.id}`} className="btn">هويتي</Link> : null}
                  {paid ? <Link href={`/plan/${r.id}`} className="btn">الخطة</Link> : null}
                  {paid ? <Link href={`/feedback/${r.id}`} className="btn">الناس</Link> : null}
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
