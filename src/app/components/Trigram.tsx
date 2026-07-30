// Renderiza um trigrama do I Ching desenhado com barras (linhas
// sólidas / partidas) — estética limpa e caligráfica, o elemento de
// assinatura da app. `lines` é lido de cima para baixo (yang = sólida).
interface TrigramProps {
  glyph: string;          // ex: "☰"
  size?: number;          // largura em px
  color?: string;
  className?: string;
}

// Mapa dos 8 trigramas → 3 linhas (true = sólida/yang, false = partida/yin)
const TRIGRAM_LINES: Record<string, boolean[]> = {
  "☰": [true, true, true],
  "☱": [false, true, true],
  "☲": [true, false, true],
  "☳": [false, false, true],
  "☴": [true, true, false],
  "☵": [false, true, false],
  "☶": [true, false, false],
  "☷": [false, false, false],
};

export function Trigram({ glyph, size = 40, color = "var(--tkd-text)", className = "" }: TrigramProps) {
  const lines = TRIGRAM_LINES[glyph] ?? [true, true, true];
  const barHeight = Math.max(2, Math.round(size * 0.11));
  const gap = Math.round(size * 0.14);
  const segGap = Math.round(size * 0.16);

  return (
    <div
      className={className}
      style={{ width: size, display: "flex", flexDirection: "column", gap }}
      aria-hidden="true"
    >
      {lines.map((solid, i) => (
        <div key={i} style={{ display: "flex", gap: segGap, height: barHeight }}>
          {solid ? (
            <span style={{ flex: 1, background: color, borderRadius: barHeight }} />
          ) : (
            <>
              <span style={{ flex: 1, background: color, borderRadius: barHeight }} />
              <span style={{ flex: 1, background: color, borderRadius: barHeight }} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
