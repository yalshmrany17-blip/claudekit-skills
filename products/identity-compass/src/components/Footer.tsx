import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-start gap-x-10 gap-y-4 px-5 py-8 text-sm text-muted">
        <div className="max-w-md">
          <div className="font-semibold text-ink">{SITE.name}</div>
          <p className="mt-1 leading-relaxed">
            تقييم تطويري لا علاجي: لا يشخّص حالات نفسية ولا يغني عن استشارة مختص. إجاباتك ملكك وتُحذف بطلبك.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Link href="/privacy" className="hover:text-ink">الخصوصية</Link>
          <Link href="/terms" className="hover:text-ink">الشروط</Link>
          <Link href="/#faq" className="hover:text-ink">الأسئلة الشائعة</Link>
        </div>
        <div className="ms-auto">© {new Date().getFullYear()} {SITE.name}</div>
      </div>
    </footer>
  );
}
