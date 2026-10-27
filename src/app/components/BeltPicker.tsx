import { BELTS } from "../data/pratica";
import { BeltStrip } from "./BeltStrip";

// Selector de cinto usado nos editores ("" = nenhum)
export function BeltPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div>
      <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Cinto</label>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => onChange("")}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-display transition-colors"
          style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", background: !value ? "var(--tkd-surface)" : "transparent", color: !value ? "var(--tkd-text)" : "var(--tkd-muted)", border: `1px solid ${!value ? "var(--tkd-muted)" : "var(--tkd-border)"}` }}>
          Nenhum
        </button>
        {BELTS.map(b => (
          <button key={b.id} type="button" onClick={() => onChange(b.id)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-display transition-colors"
            style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", background: value === b.id ? b.color + "22" : "transparent", color: value === b.id ? b.color : "var(--tkd-muted)", border: `1px solid ${value === b.id ? b.color : "var(--tkd-border)"}` }}>
            <BeltStrip color={b.color} stripe={b.stripe} width={22} height={6} />
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
