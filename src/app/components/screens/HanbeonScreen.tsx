import { HANBEON } from "../../data/pratica";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

export function HanbeonScreen({ onOpen, onNovo }: { onOpen: (id: string) => void; onNovo: () => void }) {
  const { isAdmin } = useAdmin();
  const list = HANBEON;
  return (
    <div>
      <div className="px-4 pt-6 pb-4 flex items-end justify-between">
        <div>
          <p className="font-display mb-1" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tkd-red)" }}>한번겨루기</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--tkd-text)" }}>Hanbeon Kyorugi</h1>
          <p style={{ fontSize: 14, color: "var(--tkd-muted)", marginTop: 4 }}>Combate de um passo</p>
        </div>
        {isAdmin && (
          <button type="button" onClick={onNovo} className="rounded-xl px-3 py-1.5 font-display transition-opacity active:opacity-70"
            style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-red)", color: "#fff" }}>+ Novo</button>
        )}
      </div>

      <ul className="px-4 flex flex-col gap-3">
        {list.map(hb => (
          <li key={hb.id}>
            <button
              type="button"
              onClick={() => onOpen(hb.id)}
              className="w-full text-left rounded-2xl px-5 py-4 transition-opacity active:opacity-70"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center rounded-xl font-display font-bold shrink-0"
                  style={{ width: 38, height: 38, background: "var(--tkd-red)", color: "#fff", fontSize: 16 }}
                >
                  {hb.numero}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tkd-text)" }}>{hb.ataque}</p>
                  <p style={{ fontSize: 12, color: "var(--tkd-muted)", marginTop: 2 }}>
                    {hb.passos.length} movimentos
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
