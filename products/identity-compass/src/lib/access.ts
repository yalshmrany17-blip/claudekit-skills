import { createClient } from "@/lib/supabase/server";

export const FREE_MODE = process.env.FREE_MODE === "true";

/** هل يملك المستخدم الحالي التقرير الكامل لهذا التقييم؟ */
export async function hasFullAccess(assessmentId: string): Promise<boolean> {
  if (FREE_MODE) return true;
  const supabase = await createClient();
  const { data } = await supabase
    .from("purchases")
    .select("id")
    .eq("assessment_id", assessmentId)
    .eq("status", "paid")
    .limit(1);
  return Boolean(data && data.length);
}
