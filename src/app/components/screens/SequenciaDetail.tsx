import { useSequencias } from "../../hooks/useSequencias";
import { SEQUENCIAS } from "../../data/pratica";
import { TECHNIQUES } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

export function SequenciaDetail({ id, onBack, onEdit, onOpenTechnique }: {
  id: string;
  onBack: () => void;
  onEdit: () => void;
  onOpenTechnique: (id: string) => void;
}) {
  const { eliminar } = useSequencias();
  const { isAdmin } = useAdmin();
  const seq = SEQUENCIAS.find(s => s.id === id);
  if (!seq) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Eliminar "${seq.nome}"?`)) return;
    try {
      await eliminar(id);
      onBack();
    } catch (err: any) {
      alert(err.message ?? String(err));
    }
  };

  return (
    <div>
      <DetailHeader onBack={onBack} label="Sequências" />
      <div className="px-4">
        {/* Header card */}
        <div className="rounded-2xl px-5 py-5 mb-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: "var(--tkd-text)" }}>{seq.nome}</p>
          {seq.descricao && (
            <p style={{ fontSize: 14, color: "var(--tkd-muted)", marginTop: 6 }}>{seq.descricao}</p>
          )}
          {isAdmin && (
            <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl px-4 py-2 font-display transition-opacity active:opacity-70"
              style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-blue)", color: "#fff" }}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl px-4 py-2 font-display transition-opacity active:opacity-70"
              style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px solid var(--tkd-border)" }}
            >
              Eliminar
            </button>
          </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {seq.passos.map((passo, i) => {
            const t = passo.techniqueId ? TECHNIQUES.find(x => x.id === passo.techniqueId) : null;
            return (
              <div key={passo.id} className="rounded-2xl px-5 py-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
                <div className="flex gap-3">
                  <span
                    className="font-display font-bold rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{ width: 24, height: 24, fontSize: 12, background: "var(--tkd-red)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p style={{ fontSize: 15, color: "var(--tkd-text)", lineHeight: 1.55 }}>{passo.descricao}</p>
                    {passo.nota && (
                      <p style={{ fontSize: 13, color: "var(--tkd-muted)", marginTop: 4, fontStyle: "italic" }}>{passo.nota}</p>
                    )}
                    {t && (
                      <button
                        type="button"
                        onClick={() => onOpenTechnique(t.id)}
                        className="mt-3 rounded-lg px-3 py-1 font-display transition-opacity active:opacity-70"
                        style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", background: "var(--tkd-bg)", color: "var(--tkd-blue)", border: "1px solid var(--tkd-border)" }}
                      >
                        {t.roman}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
