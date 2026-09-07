import { BIG5_NAMES, VALUE_NAMES } from "@/lib/engine/items";
import { INDEX_LABEL, MARCIA_LABEL, big5Band, BAND_LABEL } from "@/lib/engine/report";
import type { Big5Key, Result } from "@/lib/engine/types";

export function Gauge({ score, band }: { score: number; band: Result["index"]["band"] }) {
  const color = band === "high" ? "var(--good)" : band === "mid" ? "var(--accent)" : "var(--bad)";
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" width="96" height="96" aria-label={`مؤشر وضوح الهوية ${score} من 100`}>
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--line)" strokeWidth="3.2" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeDasharray={`${score} 100`} transform="rotate(-90 18 18)" />
        <text x="18" y="21" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--ink)">{score}</text>
      </svg>
      <div>
        <div className="text-sm font-semibold text-muted">مؤشر وضوح الهوية</div>
        <div className="text-2xl font-bold">{INDEX_LABEL[band]}</div>
        <div className="text-sm text-muted">من 100 · يجمع وضوح الذات وعلامات الخلل والالتزام والدوافع السلبية</div>
      </div>
    </div>
  );
}

export function Big5Bars({ big5 }: { big5: Result["big5"] }) {
  const keys: Big5Key[] = ["O", "C", "E", "A", "N"];
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 text-sm">
      {keys.map((k) => (
        <BarRow key={k} label={BIG5_NAMES[k]} value={big5[k]} suffix={BAND_LABEL[big5Band(big5[k])]} />
      ))}
    </div>
  );
}

export function ValueBars({ values }: { values: Result["values"] }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 text-sm">
      {values.ranked.map((k) => (
        <BarRow key={k} label={VALUE_NAMES[k]} value={Math.round(((values.raw[k] - 1) / 5) * 100)} suffix={values.raw[k].toFixed(1)} />
      ))}
    </div>
  );
}

function BarRow({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <>
      <span className="font-medium">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
      <span className="text-muted tabular-nums">{suffix}</span>
    </>
  );
}

export function StatusChips({ result }: { result: Result }) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span className="pill bg-panel border border-line">علامات الخلل: {result.signs.score}/9</span>
      <span className="pill bg-panel border border-line">وضوح الذات: {result.clarity.score}/30</span>
      <span className="pill bg-panel border border-line">الحالة: {MARCIA_LABEL[result.marcia.status]}</span>
      {result.erikson ? <span className="pill bg-panel border border-line">المرحلة {result.erikson.stage}: {result.erikson.name}</span> : null}
    </div>
  );
}
