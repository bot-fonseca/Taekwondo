import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, TECHNIQUES, type CategoryId } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { SectionTitle, HangulPair } from "../atoms";

const DECOR: Record<CategoryId, string> = {
  seogi: "☷",
  jireugi: "☲",
  makgi: "☵",
  chagi: "☳",
};

export function TechniquesScreen({ onOpen, onNova }: {
  onOpen: (id: string) => void;
  onNova: () => void;
}) {
  const [filter, setFilter] = useState<CategoryId>("seogi");
  const { isAdmin } = useAdmin();

  const list = useMemo(() => {
    return TECHNIQUES.filter(t => t.category === filter);
  }, [filter, TECHNIQUES.length]);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-1">
        <SectionTitle decor="☲">Técnicas soltas</SectionTitle>
        <button
          type="button"
          onClick={onNova}
          className="rounded-xl px-3 py-1.5 font-display transition-opacity active:opacity-70"
          style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--tkd-red)", color: "#fff" }}
        >
          + Nova
        </button>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.label} korean={c.roman} />
        ))}
      </div>

      <ul className="flex flex-col gap-2 pb-2">
        {list.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onOpen(t.id)}
              className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <span className="shrink-0 rounded-md" style={{ width: 6, height: 40, background: "var(--tkd-red)" }} />
              <div className="flex-1 min-w-0">
                <HangulPair hangul={t.hangul} roman={t.roman} size="sm" />
                <span style={{ fontSize: 14, color: "var(--tkd-text)" }}>{t.pt}</span>
              </div>
              <ChevronRight size={18} color="var(--tkd-muted)" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({ active, onClick, label, korean }: { active: boolean; onClick: () => void; label: string; korean: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full px-4 py-2 whitespace-nowrap transition-colors"
      style={{
        background: active ? "var(--tkd-red)" : "var(--tkd-surface)",
        border: `1px solid ${active ? "var(--tkd-red)" : "var(--tkd-border)"}`,
        color: active ? "#fff" : "var(--tkd-text)",
        fontSize: 14,
      }}
    >
      {label} <span className="font-kr opacity-70" style={{ fontSize: 12 }}>{korean}</span>
    </button>
  );
}
