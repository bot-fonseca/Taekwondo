import { ChevronRight } from "lucide-react";
import { BELTS, HANBEON, HO_SHIN_SUL, SEQUENCIAS, poomsaeForBelt } from "../data/pratica";
import { setMyBelt, useMyBelt } from "../hooks/useMyBelt";
import { BeltStrip } from "./BeltStrip";

const labelStyle = {
  fontSize: 13,
  color: "var(--tkd-muted)",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

// Cartão "O meu cinto" no Início: escolher o cinto, ou ver o que há para treinar nele
export function MyBeltCard({ onOpenBelt }: { onOpenBelt: (beltId: string) => void }) {
  const myBelt = useMyBelt();
  const belt = BELTS.find(b => b.id === myBelt);

  if (!belt) {
    return (
      <div className="mb-6">
        <p className="font-display mb-1" style={labelStyle}>O meu cinto</p>
        <p className="mb-3" style={{ fontSize: 14, color: "var(--tkd-muted)" }}>
          Escolhe o teu cinto para veres o que tens de treinar.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {BELTS.map(b => (
            <button key={b.id} type="button" onClick={() => setMyBelt(b.id)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-display transition-opacity active:opacity-70"
              style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--tkd-text)", border: "1px solid var(--tkd-border)", background: "var(--tkd-surface)" }}>
              <BeltStrip color={b.color} stripe={b.stripe} width={22} height={6} />
              {b.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const poomsae = poomsaeForBelt(belt.id);
  const counts = [
    [HANBEON.filter(h => h.belt === belt.id).length, "Hanbeon"],
    [HO_SHIN_SUL.filter(h => h.belt === belt.id).length, "Ho Shin Sul"],
    [SEQUENCIAS.filter(s => s.belt === belt.id).length, "Sequências"],
  ] as const;
  const summary = [
    ...poomsae.map(p => p.name),
    ...counts.filter(([n]) => n > 0).map(([n, label]) => `${n} ${label}`),
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display" style={labelStyle}>O meu cinto</p>
        <button type="button" onClick={() => setMyBelt(null)}
          className="font-display" style={{ ...labelStyle, fontSize: 11 }}>
          Mudar
        </button>
      </div>
      <button
        type="button"
        onClick={() => onOpenBelt(belt.id)}
        className="w-full rounded-xl px-4 py-4 flex items-center gap-4 text-left transition-opacity active:opacity-70"
        style={{ background: "var(--tkd-surface)", border: `1px solid ${belt.color}55` }}
      >
        <BeltStrip color={belt.color} stripe={belt.stripe} width={44} height={8} vertical />
        <span className="flex-1 min-w-0">
          <span className="block font-display" style={{ fontSize: 17, letterSpacing: "0.02em" }}>{belt.label}</span>
          <span className="font-kr block" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{belt.korean} · {belt.roman}</span>
          <span className="block mt-1" style={{ fontSize: 13, color: "var(--tkd-text)" }}>
            {summary.length > 0 ? summary.join(" · ") : "Ainda sem conteúdo para este cinto."}
          </span>
        </span>
        <ChevronRight size={20} color="var(--tkd-muted)" />
      </button>
    </div>
  );
}
