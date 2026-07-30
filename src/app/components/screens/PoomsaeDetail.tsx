import { POOMSAE } from "../../data/taekwondo";
import { Trigram } from "../Trigram";
import { DetailHeader } from "./DetailHeader";

export function PoomsaeDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const p = POOMSAE.find((x) => x.id === id);
  if (!p) return null;

  return (
    <div>
      <DetailHeader onBack={onBack} label="Poomsae" />
      <div className="px-4">
        <div
          className="rounded-2xl px-5 py-6 flex items-center gap-4"
          style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
        >
          <Trigram glyph={p.trigram} size={56} color="var(--tkd-text)" />
          <div className="flex-1 min-w-0">
            <p className="font-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.02em" }}>{p.name}</p>
            <p className="font-kr" style={{ fontSize: 15, color: "var(--tkd-blue)", fontWeight: 600 }}>{p.hangul}</p>
            <p style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{p.trigramName}</p>
          </div>
          <div className="text-center shrink-0">
            <span className="block font-display" style={{ fontSize: 30, fontWeight: 700, color: "var(--tkd-red)", lineHeight: 1 }}>{p.moves}</span>
            <span style={{ fontSize: 11, color: "var(--tkd-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>movimentos</span>
          </div>
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--tkd-text)" }} className="mt-4 italic">{p.meaning}</p>

        <p className="font-display mt-6 mb-3" style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
          Sequência passo-a-passo
        </p>
        <ol className="flex flex-col gap-2 pb-2">
          {p.steps.map((s) => (
            <li
              key={s.n}
              className="rounded-xl px-3 py-3 flex gap-3"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <span
                className="shrink-0 flex items-center justify-center rounded-lg font-display"
                style={{ width: 34, height: 34, background: "var(--tkd-blue-soft)", border: "1px solid rgba(43,90,130,0.4)", fontSize: 16, fontWeight: 600, color: "var(--tkd-text)" }}
              >
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--tkd-text)" }}>{s.technique}</span>
                  {s.hangul !== "—" && <span className="font-kr" style={{ fontSize: 14, color: "var(--tkd-blue)" }}>{s.hangul}</span>}
                </div>
                <p style={{ fontSize: 13, color: "var(--tkd-muted)", lineHeight: 1.4 }}>{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
