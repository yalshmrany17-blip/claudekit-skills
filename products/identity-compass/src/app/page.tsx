import Link from "next/link";
import { SITE } from "@/lib/site";
import { Compass } from "@/components/Nav";

const STEPS = [
  { n: "١", t: "أجب عن تسعين سؤالاً", d: "خمس عشرة دقيقة: علامات الخلل، وضوح الذات، سمات الشخصية، القيم، الدوافع السلبية، وست إجابات بكلماتك." },
  { n: "٢", t: "اقرأ نتيجتك فوراً", d: "مؤشر وضوح الهوية، حالة هويتك، مرحلتك العمرية، وسماتك الخمس. مجاناً وبلا تسجيل بطاقة." },
  { n: "٣", t: "احصل على التقرير الكامل", d: "قيمك مرتبة، ما تحرسه، مبدأ هويتك، خطة تسعين يوماً، وسرد شخصي يكتبه الذكاء الاصطناعي من إجاباتك." },
];

const FREE = ["مؤشر وضوح الهوية من 100", "علامات الخلل التسع", "وضوح مفهوم الذات", "حالة الهوية: استكشاف والتزام", "مرحلتك عند إريكسون", "سمات الشخصية الخمس"];
const PAID = [
  "ماذا تعني سماتك لهويتك",
  "قيمك العشر مرتبة وتوجهك الغالب",
  "الدوافع السلبية وممارسة لكل واحدة",
  "مبدأ هويتك في سطر",
  "خطة التسعين يوماً: عادات وتجارب ومعالم بتواريخ",
  "سرد شخصي من 800 كلمة مبني على إجاباتك",
  "موعد المراجعة وأرقام المقارنة",
  "طباعة أو حفظ PDF",
];

const SCIENCE = [
  ["الخمسة الكبرى", "أكثر نماذج الشخصية تأكيداً في علم النفس، بثلاثين عبارة أصلية."],
  ["قيم شوارتز", "عشر قيم أساسية وأربعة توجهات، مرتبة نسبياً لا مطلقاً."],
  ["حالات مارسيا ومراحل إريكسون", "أين أنت بين الاستكشاف والالتزام، وما سؤال مرحلتك العمرية."],
  ["وضوح مفهوم الذات", "كم تعرف نفسك بثبات، وهو ما تربطه الأبحاث بالقلق وتقدير الذات."],
  ["نوايا التنفيذ", "عاداتك بصيغة «إذا حدث كذا فسأفعل كذا»، من أكثر أساليب تغيير السلوك تأكيداً."],
];

const FAQ = [
  ["هل هذا اختبار نفسي رسمي؟", "لا. هو تقييم تطويري يعتمد على مفاهيم علمية منشورة، لكنه ليس أداة تشخيص ولا يغني عن مختص."],
  ["كم يستغرق؟", `حوالي ${SITE.minutes} دقيقة. إجاباتك تُحفظ تلقائياً في متصفحك ويمكنك العودة لاحقاً.`],
  ["ماذا يحدث لإجاباتي؟", "تُحفظ في حسابك فقط لتوليد تقريرك ومقارنة نتائجك لاحقاً. لا تُباع ولا تُشارك، وتُحذف بطلبك."],
  ["هل أحتاج التقرير الكامل؟", "النتيجة المجانية تخبرك أين أنت. التقرير الكامل يخبرك ماذا تفعل: قيم، حدود، خطة، وسرد شخصي."],
  ["هل أعيد التقييم؟", "نعم، ننصح بإعادته بعد ستة أشهر. تقريرك يحفظ أرقام اليوم لتقارن بها."],
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="grid items-center gap-10 py-14 md:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <p className="text-sm font-semibold text-accent-deep">تقييم الهوية الشخصية</p>
          <h1 className="display mt-2 text-5xl leading-tight md:text-6xl">اعرف من أنت قبل أن تقرر إلى أين تذهب.</h1>
          <p className="mt-5 max-w-prose text-lg text-muted">
            {SITE.items} سؤالاً مبنية على أبحاث علم النفس، ونتيجة فورية، وتقرير كامل يحوّل الأرقام إلى قيم وحدود وخطة تسعين يوماً.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/test" className="btn-primary px-7 text-lg">ابدأ التقييم مجاناً</Link>
            <a href="#how" className="btn px-6">كيف يعمل؟</a>
          </div>
          <p className="mt-3 text-sm text-muted">{SITE.minutes} دقيقة · النتيجة الأولى مجانية · بلا بطاقة</p>
        </div>
        <div className="hidden justify-center md:flex">
          <Compass size={220} />
        </div>
      </section>

      <section id="how" className="border-t border-line py-14">
        <h2 className="display text-4xl">كيف يعمل</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div className="display text-4xl text-accent">{s.n}</div>
              <h3 className="mt-2 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-14">
        <h2 className="display text-4xl">ماذا تحصل عليه</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card">
            <div className="flex items-center gap-3">
              <span className="pill bg-good-soft text-good">مجاني</span>
              <h3 className="text-lg font-bold">النتيجة الأولى</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {FREE.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-good">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="card border-accent">
            <div className="flex items-center gap-3">
              <span className="pill bg-accent-soft text-accent-deep">{SITE.price.report} {SITE.price.currency}</span>
              <h3 className="text-lg font-bold">التقرير الكامل</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {PAID.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-accent-deep">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14">
        <h2 className="display text-4xl">العلم وراءه</h2>
        <p className="mt-3 max-w-prose text-muted">العبارات كلها أصلية، والمفاهيم المقاسة من أكثر النماذج تأكيداً في أبحاث الشخصية والهوية.</p>
        <dl className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {SCIENCE.map(([t, d]) => (
            <div key={t}>
              <dt className="font-bold">{t}</dt>
              <dd className="text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="pricing" className="border-t border-line py-14">
        <h2 className="display text-4xl">الأسعار</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="card">
            <h3 className="text-lg font-bold">النتيجة الأولى</h3>
            <div className="mt-2 text-3xl font-bold">مجاناً</div>
            <p className="mt-2 text-muted">ستة مؤشرات تخبرك أين أنت اليوم.</p>
            <Link href="/test" className="btn mt-5 w-full">ابدأ</Link>
          </div>
          <div className="card border-accent">
            <h3 className="text-lg font-bold">التقرير الكامل</h3>
            <div className="mt-2 text-3xl font-bold">{SITE.price.report} <span className="text-base font-semibold text-muted">{SITE.price.currency} · مرة واحدة</span></div>
            <p className="mt-2 text-muted">كل ما في النتيجة الأولى، مع القيم والحدود والخطة والسرد الشخصي.</p>
            <Link href="/test" className="btn-primary mt-5 w-full">ابدأ ثم افتح التقرير</Link>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold">بلس <span className="pill bg-accent-soft text-accent-deep">قريباً</span></h3>
            <div className="mt-2 text-3xl font-bold">{SITE.price.plus} <span className="text-base font-semibold text-muted">{SITE.price.currency} · شهرياً</span></div>
            <p className="mt-2 text-muted">إعادة التقييم كل ستة أشهر، أداة رسالة العشرة أشخاص، ومتابعة خطة التسعين يوماً.</p>
            <button className="btn mt-5 w-full" disabled>انضم لقائمة الانتظار</button>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-line py-14">
        <h2 className="display text-4xl">أسئلة شائعة</h2>
        <div className="mt-6 divide-y divide-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="cursor-pointer list-none font-bold">{q}</summary>
              <p className="mt-2 max-w-prose text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
