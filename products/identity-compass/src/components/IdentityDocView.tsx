import { composeMission, type IdentityDoc } from "@/lib/engine/identity";

/** عرض وثيقة الهوية كما ستُطبع أو تُشارك. القسم الأول (الوجه العام) يصلح للنشر. */
export function IdentityDocView({ doc, name }: { doc: IdentityDoc; name?: string }) {
  const mission = doc.mission.final || composeMission(doc.mission);
  const p = doc.positioning;
  const v = doc.visible;
  const vals = doc.values.filter((x) => x.name);
  const pillars = doc.pillars.filter(Boolean);
  const bounds = doc.boundaries.filter(Boolean);
  const empty = !doc.line && !mission && !vals.length;

  if (empty) return <p className="text-muted">اكتب في الخطوات أعلاه وستتجمع وثيقتك هنا.</p>;

  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-accent-deep">وثيقة الهوية الشخصية{name ? ` · ${name}` : ""}</p>
        {doc.line ? <p className="display mt-1 text-3xl text-accent-deep">{doc.line}</p> : null}
      </header>

      <section>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold">الوجه العام</h3>
          <span className="pill bg-good-soft text-good">يصلح للنشر</span>
        </div>
        {mission ? <p className="mt-2 max-w-prose"><span className="font-semibold text-muted">الرسالة:</span> {mission}</p> : null}
        {p.for || p.what ? (
          <p className="mt-2 max-w-prose"><span className="font-semibold text-muted">التموضع:</span> {[p.for && `لـ ${p.for}`, p.what && `أقدم ${p.what}`, p.unlike && `على عكس ${p.unlike}`, p.because && `لأنني ${p.because}`].filter(Boolean).join("، ")}.</p>
        ) : null}
        {pillars.length ? <p className="mt-2"><span className="font-semibold text-muted">الركائز:</span> {pillars.join(" · ")}</p> : null}
        {v.bio ? <p className="mt-2 max-w-prose"><span className="font-semibold text-muted">النبذة:</span> {v.bio}</p> : null}
        {v.tone || v.dress || v.colors || v.signature ? (
          <ul className="mt-2 list-disc ps-6 text-sm">
            {v.tone ? <li>النبرة: {v.tone}</li> : null}
            {v.dress ? <li>اللبس: {v.dress}</li> : null}
            {v.colors ? <li>الألوان: {v.colors}</li> : null}
            {v.signature ? <li>العلامة المميزة: {v.signature}</li> : null}
          </ul>
        ) : null}
        {v.now3 || v.goal3 ? <p className="mt-2 text-sm">الكلمات: اليوم «{v.now3 || "—"}» ← بعد سنة «{v.goal3 || "—"}»</p> : null}
      </section>

      {vals.length ? (
        <section>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">القيم</h3>
            <span className="pill bg-warn-soft text-warn">داخلي</span>
          </div>
          <ul className="mt-2 space-y-2">
            {vals.map((x, i) => (
              <li key={i} className="rounded-lg bg-accent-soft px-4 py-2 text-sm">
                <span className="display text-xl text-accent-deep">{x.name}</span>
                {x.means ? <div><span className="text-muted">تعني عندي:</span> {x.means}</div> : null}
                {x.broke ? <div><span className="text-muted">خالفتها عندما:</span> {x.broke}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {bounds.length ? (
        <section>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">الحدود</h3>
            <span className="pill bg-warn-soft text-warn">داخلي</span>
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6">
            {bounds.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}
