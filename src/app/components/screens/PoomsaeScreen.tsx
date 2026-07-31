import { useState } from "react";
import { POOMSAE, setPoomsae } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { saveResource, DEV_ONLY_MSG } from "../../hooks/useAdminSave";
import { SectionTitle } from "../atoms";
import { Trigram } from "../Trigram";

export function PoomsaeScreen({ onOpen, onNova }: {
  onOpen: (id: string) => void;
  onNova: () => void;
}) {
  const [group, setGroup] = useState<"Taeguk" | "Palgwe">("Taeguk");
  const { isAdmin } = useAdmin();
  const list = POOMSAE.filter((p) => p.group === group);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Eliminar "${name}"?`)) return;
    try {
      const updated = POOMSAE.filter(p => p.id !== id);
      await saveResource("poomsae", updated);
      setPoomsae(updated);
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-1">
        <SectionTitle decor="☰">Poomsae</SectionTitle>
        {isAdmin && (
          <button
            type="button"
            onClick={onNova}
            className="rounded-xl px-3 py-1.5 font-display transition-opacity active:opacity-70"
            style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-red)", color: "#fff" }}
          >
            + Nova
          </button>
        )}
      </div>

      {/* Alternador de grupo */}
      <div className="flex gap-2 mb-4 p-1 rounded-xl" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
        {(["Taeguk", "Palgwe"] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className="flex-1 rounded-lg py-2 font-display transition-colors"
            style={{
              background: group === g ? "var(--tkd-blue)" : "transparent",
              color: group === g ? "#fff" : "var(--tkd-muted)",
              fontSize: 15,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2">
        {list.map((p) => (
          <div key={p.id} className="relative">
            <button
              type="button"
              onClick={() => onOpen(p.id)}
              className="w-full rounded-xl p-4 flex flex-col items-start gap-3"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <div className="flex items-center justify-between w-full">
                <Trigram glyph={p.trigram} size={38} color="var(--tkd-text)" />
                <span className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "var(--tkd-red)", lineHeight: 1 }}>
                  {p.index}
                </span>
              </div>
              <div>
                <span className="block font-display" style={{ fontSize: 15, letterSpacing: "0.02em" }}>{p.name}</span>
                <span className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{p.hangul}</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--tkd-muted)" }}>{p.trigramName} · {p.moves} mov.</span>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.name)}
                className="absolute top-2 right-2 rounded-lg w-6 h-6 flex items-center justify-center transition-opacity active:opacity-70"
                style={{ background: "var(--tkd-red)", color: "#fff", fontSize: 12, lineHeight: 1 }}
                title="Eliminar"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
