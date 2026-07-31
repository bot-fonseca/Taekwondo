import { BELTS, HANBEON, HO_SHIN_SUL, SEQUENCIAS } from "../../data/pratica";
import { BeltStrip } from "../BeltStrip";
import { SectionTitle } from "../atoms";

export function BeltScreen({
  onOpenBelt,
  onAllHanbeon,
  onAllHoShin,
  onAllSeq,
}: {
  onOpenBelt: (beltId: string) => void;
  onAllHanbeon: () => void;
  onAllHoShin: () => void;
  onAllSeq: () => void;
}) {
  return (
    <div className="px-4 pt-6">
      <SectionTitle decor="띠">Prática</SectionTitle>
      <p style={{ fontSize: 13, color: "var(--tkd-muted)", marginBottom: 16, marginTop: -4 }}>
        Selecciona o teu cinto
      </p>

      {/* Belt cards */}
      <div className="flex flex-col gap-2.5 mb-8">
        {BELTS.map(belt => {
          const total =
            HANBEON.filter(h => h.belt === belt.id).length +
            HO_SHIN_SUL.filter(h => h.belt === belt.id).length +
            SEQUENCIAS.filter(s => s.belt === belt.id).length;

          return (
            <button
              key={belt.id}
              type="button"
              onClick={() => onOpenBelt(belt.id)}
              className="w-full text-left rounded-2xl px-5 py-4 flex items-center gap-4 transition-opacity active:opacity-70"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              {/* Belt stripe — vertical, com lista visível para cintos intermédios */}
              <BeltStrip color={belt.color} stripe={belt.stripe} width={44} height={8} vertical />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 17, fontWeight: 700, color: "var(--tkd-text)" }}>
                  {belt.label}
                </p>
                <p className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>
                  {belt.korean} · {belt.roman}
                </p>
              </div>
              {total > 0 ? (
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 font-display"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    background: belt.color + "22",
                    color: belt.color,
                    border: `1px solid ${belt.color}55`,
                  }}
                >
                  {total}
                </span>
              ) : (
                <span style={{ fontSize: 18, color: "var(--tkd-border)" }}>›</span>
              )}
            </button>
          );
        })}
      </div>

      {/* All-content shortcuts */}
      <p
        className="font-display mb-3"
        style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tkd-muted)" }}
      >
        Ver todos
      </p>
      <div className="flex flex-col gap-2 pb-2">
        {[
          { label: "한번겨루기", title: "Hanbeon Kyorugi",  sub: "Combate de um passo",          onClick: onAllHanbeon },
          { label: "호신술",    title: "Ho Shin Sul",       sub: "Auto-defesa",                   onClick: onAllHoShin },
          { label: "순서",      title: "Sequências",         sub: "Combinações personalizadas",    onClick: onAllSeq },
        ].map(item => (
          <button
            key={item.title}
            type="button"
            onClick={item.onClick}
            className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity active:opacity-70"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
          >
            <div className="flex-1 min-w-0">
              <span className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{item.label}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--tkd-text)", marginLeft: 8 }}>{item.title}</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--tkd-muted)" }}>{item.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
