import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "الخصوصية" };

export default function PrivacyPage() {
  return (
    <div className="container-prose py-12 space-y-4">
      <h1 className="display text-4xl">سياسة الخصوصية</h1>
      <p>نجمع إجاباتك على التقييم وبريدك الإلكتروني فقط، لغرض واحد: حساب نتيجتك وتوليد تقريرك وحفظهما في حسابك لتقارن بهما لاحقاً.</p>
      <ul className="list-disc ps-6 space-y-1">
        <li>لا نبيع بياناتك ولا نشاركها مع أي طرف لأغراض تسويقية.</li>
        <li>يُرسل ملخص أرقامك وإجاباتك المفتوحة إلى مزود الذكاء الاصطناعي لتوليد السرد الشخصي عند طلبك فقط.</li>
        <li>الدفع يتم عبر مزود دفع خارجي ولا نخزن بيانات بطاقتك.</li>
        <li>يمكنك طلب حذف حسابك وبياناتك كاملة في أي وقت.</li>
        <li>نلتزم بنظام حماية البيانات الشخصية في المملكة العربية السعودية.</li>
      </ul>
      <p className="text-muted">{SITE.name} تقييم تطويري لا علاجي، ولا يشخّص حالات نفسية.</p>
    </div>
  );
}
