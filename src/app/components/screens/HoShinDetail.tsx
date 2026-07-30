import { HO_SHIN_SUL } from "../../data/pratica";
import { TECHNIQUES } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

export function HoShinDetail({ id, onBack, onOpenTechnique, onEdit }: {
  id: string;
  onBack: () => void;
  onOpenTechnique: (id: string) => void;
  onEdit?: () => void;
}) {
  const { isAdmin } = useAdmin();
  const hs = HO_SHIN_SUL.find(h => h.id === id);
  if (!hs) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar "${hs.situacao}"?`)) return;
    try {
      const { HO_SHIN_SUL: H, setHoShinSul } = await import("../../data/pratica");
      const { saveResource, DEV_ONLY_MSG } = await import("../../hooks/useAdminSave");
      const updated = H.filter((h: any) => h.id !== id);
      await saveResource("hoshin", updated);
      setHoShinSul(updated);
      onBack();
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? "Só disponível em modo dev (pnpm dev)" : (err.message ?? String(err)));
    }
  };

  return (
    <div>
      <DetailHeader onBack={onBack} label="Ho Shin Sul" />
      <div className="px-4">
        {/* Header */}
        <div className="rounded-2xl px-5 py-5 mb-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
          <p className="font-display mb-1" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Situação</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tkd-text)" }}>{hs.situacao}</p>
          {isAdmin && (
            <div className="flex gap-2 mt-3">
              {onEdit && <button type="button" onClick={onEdit} className="rounded-xl px-4 py-2 font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-blue)", color: "#fff" }}>Editar</button>}
              <button type="button" onClick={handleDelete} className="rounded-xl px-4 py-2 font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px solid var(--tkd-border)" }}>Eliminar</button>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {hs.passos.map((passo, i) => (
            <div key={i} className="rounded-2xl px-5 py-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
              <div className="flex gap-3">
                <span
                  className="font-display font-bold rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                  style={{ width: 24, height: 24, fontSize: 12, background: "var(--tkd-blue)" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p style={{ fontSize: 15, color: "var(--tkd-text)", lineHeight: 1.55 }}>{passo.descricao}</p>

                  {passo.techniqueIds && passo.techniqueIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {passo.techniqueIds.map(tid => {
                        const t = TECHNIQUES.find(x => x.id === tid);
                        if (!t) return null;
                        return (
                          <button
                            key={tid}
                            type="button"
                            onClick={() => onOpenTechnique(tid)}
                            className="rounded-lg px-3 py-1 font-display transition-opacity active:opacity-70"
                            style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--tkd-bg)", color: "var(--tkd-blue)", border: "1px solid var(--tkd-border)" }}
                          >
                            {t.roman}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
