import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "الشروط" };

export default function TermsPage() {
  return (
    <div className="container-prose py-12 space-y-4">
      <h1 className="display text-4xl">شروط الاستخدام</h1>
      <ul className="list-disc ps-6 space-y-1">
        <li>{SITE.name} أداة تطوير ذاتي تعتمد على مفاهيم علمية منشورة، وليست أداة تشخيص طبي أو نفسي ولا تغني عن استشارة مختص.</li>
        <li>النتائج مبنية على إجاباتك؛ دقتها تعتمد على صدقك.</li>
        <li>التقرير الكامل شراء لمرة واحدة لكل تقييم، ويبقى في حسابك.</li>
        <li>يمكن استرداد المبلغ خلال 14 يوماً إذا لم تفتح التقرير الكامل بعد.</li>
        <li>يُمنع إعادة بيع محتوى التقييم أو نسخ عباراته.</li>
      </ul>
    </div>
  );
}
