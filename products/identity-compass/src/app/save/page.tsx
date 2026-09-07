import type { Metadata } from "next";
import { SaveClient } from "@/components/SaveClient";
import { currentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "حفظ النتيجة" };

export default async function SavePage() {
  const user = await currentUser();
  return (
    <div className="container-prose py-12 max-w-md">
      <SaveClient loggedIn={Boolean(user)} />
    </div>
  );
}
