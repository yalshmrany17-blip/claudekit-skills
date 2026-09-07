"use client";

import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn"
      onClick={async () => {
        await getBrowserClient()?.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      تسجيل الخروج
    </button>
  );
}
