import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, TECHNIQUES, type CategoryId } from "../../data/taekwondo";
import { useAdmin } from "../../context/AdminContext";
import { useTechniqueOrder } from "../../hooks/useTechniqueOrder";
import { SectionTitle, HangulPair } from "../atoms";

const DECOR: Record<CategoryId, string> = {
  seogi: "☷",
  jireugi: "☲",
  makgi: "☵",
  chagi: "☳",
};

export function TechniquesScreen({ onOpen, onNova, initialFilter = "seogi", onFilterChange }: {
  onOpen: (id: string) => void;
  onNova: () => void;
  initialFilter?: CategoryId;
  onFilterChange?: (f: CategoryId) => void;
}) {
  const [filter, setFilter] = useState<CategoryId>(initialFilter);
  const { isAdmin } = useAdmin();
  const { getOrdered, move, version } = useTechniqueOrder();

  const handleFilter = (f: CategoryId) => {
    setFilter(f);
    onFilterChange?.(f);
  };

  const list = useMemo(() => {
    const filtered = TECHNIQUES.filter(t => t.category === filter);
    return getOrdered(filter, filtered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, TECHNIQUES.length, version]);

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
          <FilterChip key={c.id} active={filter === c.id} onClick={() => handleFilter(c.id)} label={c.label} korean={c.roman} />
        ))}
      </div>

      <ul className="flex flex-col gap-2 pb-2">
        {list.map((t, idx) => (
          <li key={t.id}>
            <div
              className="flex items-center rounded-xl overflow-hidden"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
            >
              <button
                type="button"
                onClick={() => onOpen(t.id)}
                className="flex-1 text-left px-4 py-3 flex items-center gap-3 transition-opacity active:opacity-70"
              >
                <span className="shrink-0 rounded-md" style={{ width: 6, height: 40, background: "var(--tkd-red)" }} />
                <div className="flex-1 min-w-0">
                  <HangulPair hangul={t.hangul} roman={t.roman} size="sm" />
                  <span style={{ fontSize: 14, color: "var(--tkd-text)" }}>{t.pt}</span>
                </div>
                <ChevronRight size={18} color="var(--tkd-muted)" />
              </button>
              {/* Reorder controls visible to all users */}
              <div className="flex flex-col shrink-0 pr-2 gap-0.5">
                <button
                  type="button"
                  onClick={() => move(filter, list, idx, -1)}
                  disabled={idx === 0}
                  className="flex items-center justify-center w-7 h-6 rounded transition-opacity"
                  style={{ background: "var(--tkd-bg)", color: idx === 0 ? "var(--tkd-border)" : "var(--tkd-muted)", fontSize: 13 }}
                >↑</button>
                <button
                  type="button"
                  onClick={() => move(filter, list, idx, 1)}
                  disabled={idx === list.length - 1}
                  className="flex items-center justify-center w-7 h-6 rounded transition-opacity"
                  style={{ background: "var(--tkd-bg)", color: idx === list.length - 1 ? "var(--tkd-border)" : "var(--tkd-muted)", fontSize: 13 }}
                >↓</button>
              </div>
            </div>
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
