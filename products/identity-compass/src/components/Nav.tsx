import Link from "next/link";
import { SITE } from "@/lib/site";
import { currentUser } from "@/lib/supabase/server";

export function Compass({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--line)" strokeWidth="2" />
      <polygon points="21,21 52,46 79,79 48,54" fill="var(--line)" />
      <polygon points="79,21 54,52 21,79 46,48" fill="var(--line)" />
      <polygon points="50,5 56,50 50,95 44,50" fill="var(--accent)" />
      <polygon points="5,50 50,44 95,50 50,56" fill="var(--accent-deep)" />
      <circle cx="50" cy="50" r="4" fill="var(--paper)" stroke="var(--accent-deep)" strokeWidth="2" />
    </svg>
  );
}

export async function Nav() {
  const user = await currentUser();
  return (
    <nav className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold no-underline">
          <Compass />
          <span className="display text-2xl leading-none">{SITE.name}</span>
        </Link>
        {SITE.beta ? <span className="pill bg-accent-soft text-accent-deep">تجربة مفتوحة</span> : null}
        <div className="ms-auto flex items-center gap-4 text-sm font-semibold">
          <Link href="/#how" className="text-muted hover:text-ink">كيف يعمل</Link>
          <Link href="/#pricing" className="text-muted hover:text-ink">الأسعار</Link>
          {user ? (
            <Link href="/account" className="btn min-h-[38px] px-4 py-1">حسابي</Link>
          ) : (
            <Link href="/login" className="btn min-h-[38px] px-4 py-1">تسجيل الدخول</Link>
          )}
          <Link href="/test" className="btn-primary min-h-[38px] px-4 py-1">ابدأ التقييم</Link>
        </div>
      </div>
    </nav>
  );
}
