import { useState } from "react";
import { POOMSAE } from "../../data/taekwondo";
import { SectionTitle } from "../atoms";
import { Trigram } from "../Trigram";

export function PoomsaeScreen({ onOpen }: { onOpen: (id: string) => void }) {
  const [group, setGroup] = useState<"Taeguk" | "Palgwe">("Taeguk");
  const list = POOMSAE.filter((p) => p.group === group);

  return (
    <div className="px-4 pt-6">
      <SectionTitle decor="☰">Poomsae</SectionTitle>

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
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p.id)}
            className="rounded-xl p-4 flex flex-col items-start gap-3"
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
        ))}
      </div>
    </div>
  );
}
