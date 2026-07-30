import { SEQUENCIAS } from "../../data/pratica";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

export function SequenciasScreen({ onOpen, onNova }: {
  onOpen: (id: string) => void;
  onNova: () => void;
}) {
  const { isAdmin } = useAdmin();
  const sequencias = SEQUENCIAS;

  return (
    <div>
      <div className="px-4 pt-6 pb-4 flex items-end justify-between">
        <div>
          <p className="font-display mb-1" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tkd-red)" }}>
            순서
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--tkd-text)" }}>Sequências</h1>
          <p style={{ fontSize: 14, color: "var(--tkd-muted)", marginTop: 4 }}>As tuas combinações personalizadas</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={onNova}
            className="rounded-xl px-4 py-2 font-display transition-opacity active:opacity-70"
            style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-red)", color: "#fff" }}
          >
            + Nova
          </button>
        )}
      </div>

      {sequencias.length === 0 ? (
        <div className="px-4 mt-8 text-center">
          <p style={{ fontSize: 15, color: "var(--tkd-muted)" }}>Nenhuma sequência criada ainda.</p>
          <p style={{ fontSize: 14, color: "var(--tkd-muted)", marginTop: 4 }}>Clica em "+ Nova" para começar.</p>
        </div>
      ) : (
        <ul className="px-4 flex flex-col gap-3">
          {sequencias.map(s => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onOpen(s.id)}
                className="w-full text-left rounded-2xl px-5 py-4 transition-opacity active:opacity-70"
                style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
              >
                <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tkd-text)" }}>{s.nome}</p>
                {s.descricao && (
                  <p style={{ fontSize: 13, color: "var(--tkd-muted)", marginTop: 3 }}>{s.descricao}</p>
                )}
                <p style={{ fontSize: 12, color: "var(--tkd-muted)", marginTop: 6 }}>
                  {s.passos.length} {s.passos.length === 1 ? "passo" : "passos"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
