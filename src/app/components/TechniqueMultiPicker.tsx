import { CATEGORIES, TECHNIQUES } from "../data/taekwondo";

// Selecção múltipla de técnicas associadas a um passo (Hanbeon / Ho Shin Sul)
export function TechniqueMultiPicker({ values, onChange }: { values: string[]; onChange: (ids: string[]) => void }) {
  const toggle = (id: string) =>
    onChange(values.includes(id) ? values.filter(x => x !== id) : [...values, id]);
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {CATEGORIES.map(cat =>
        TECHNIQUES.filter(t => t.category === cat.id).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            className="rounded-lg px-2.5 py-1 font-display transition-colors"
            style={{
              fontSize: 10,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: values.includes(t.id) ? "var(--tkd-blue)" : "var(--tkd-bg)",
              color: values.includes(t.id) ? "#fff" : "var(--tkd-muted)",
              border: "1px solid var(--tkd-border)",
            }}
          >
            {t.roman}
          </button>
        ))
      )}
    </div>
  );
}
