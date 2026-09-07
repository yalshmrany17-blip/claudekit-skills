import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmailForm } from "@/components/EmailForm";
import { currentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await currentUser();
  if (user) redirect(next || "/account");
  return (
    <div className="container-prose py-12 max-w-md">
      <EmailForm next={next || "/account"} title="تسجيل الدخول" hint="للوصول إلى نتائجك وتقاريرك السابقة." />
    </div>
  );
}
