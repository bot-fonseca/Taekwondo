import { HO_SHIN_SUL } from "../../data/pratica";
import { useAdmin } from "../../context/AdminContext";

export function HoShinScreen({ onOpen, onNovo }: { onOpen: (id: string) => void; onNovo: () => void }) {
  const { isAdmin } = useAdmin();
  const list = HO_SHIN_SUL;
  return (
    <div>
      <div className="px-4 pt-6 pb-4 flex items-end justify-between">
        <div>
          <p className="font-display mb-1" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tkd-red)" }}>호신술</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--tkd-text)" }}>Ho Shin Sul</h1>
          <p style={{ fontSize: 14, color: "var(--tkd-muted)", marginTop: 4 }}>Técnicas de auto-defesa</p>
        </div>
        {isAdmin && (
          <button type="button" onClick={onNovo} className="rounded-xl px-3 py-1.5 font-display transition-opacity active:opacity-70"
            style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-red)", color: "#fff" }}>+ Novo</button>
        )}
      </div>

      <ul className="px-4 flex flex-col gap-3">
        {list.map((hs, i) => (
          <li key={hs.id}>
            <button
              type="button"
              onClick={() => onOpen(hs.id)}
              className="w-full text-left rounded-2xl px-5 py-4 transition-opacity active:opacity-70"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center rounded-xl font-display font-bold shrink-0"
                  style={{ width: 38, height: 38, background: "var(--tkd-blue)", color: "#fff", fontSize: 15 }}
                >
                  {i + 1}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tkd-text)" }}>{hs.situacao}</p>
                  <p style={{ fontSize: 12, color: "var(--tkd-muted)", marginTop: 2 }}>
                    {hs.passos.length} passos
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
