import { HANBEON } from "../../data/pratica";
import { TECHNIQUES } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

const ROLE_COLOR = { atacante: "var(--tkd-red)", defensor: "var(--tkd-blue)" } as const;
const ROLE_LABEL = { atacante: "Atacante", defensor: "Defensor" } as const;

export function HanbeonDetail({ id, onBack, onOpenTechnique, onEdit }: {
  id: string;
  onBack: () => void;
  onOpenTechnique: (id: string) => void;
  onEdit?: () => void;
}) {
  const { isAdmin } = useAdmin();
  const hb = HANBEON.find(h => h.id === id);
  if (!hb) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar "${hb.ataque}"?`)) return;
    try {
      const { HANBEON: H, setHanbeon } = await import("../../data/pratica");
      const { saveResource, DEV_ONLY_MSG } = await import("../../hooks/useAdminSave");
      const updated = H.filter((h: any) => h.id !== id);
      await saveResource("hanbeon", updated);
      setHanbeon(updated);
      onBack();
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? "Só disponível em modo dev (pnpm dev)" : (err.message ?? String(err)));
    }
  };

  return (
    <div>
      <DetailHeader onBack={onBack} label="Hanbeon Kyorugi" />
      <div className="px-4">
        {/* Header */}
        <div className="rounded-2xl px-5 py-5 mb-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="flex items-center justify-center rounded-xl font-display font-bold shrink-0"
              style={{ width: 42, height: 42, background: "var(--tkd-red)", color: "#fff", fontSize: 18 }}
            >
              {hb.numero}
            </span>
            <div>
              <p className="font-display" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Ataque</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: "var(--tkd-text)" }}>{hb.ataque}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2 mt-3">
              {onEdit && <button type="button" onClick={onEdit} className="rounded-xl px-4 py-2 font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-blue)", color: "#fff" }}>Editar</button>}
              <button type="button" onClick={handleDelete} className="rounded-xl px-4 py-2 font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px solid var(--tkd-border)" }}>Eliminar</button>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {hb.passos.map((passo, i) => (
            <div key={i} className="rounded-2xl px-5 py-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-display rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ width: 22, height: 22, fontSize: 11, background: ROLE_COLOR[passo.papel] }}
                >
                  {i + 1}
                </span>
                <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: ROLE_COLOR[passo.papel] }}>
                  {ROLE_LABEL[passo.papel]}
                </span>
              </div>
              <p style={{ fontSize: 15, color: "var(--tkd-text)", lineHeight: 1.5 }}>{passo.descricao}</p>

              {/* Technique links */}
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
          ))}
        </div>
      </div>
    </div>
  );
}
