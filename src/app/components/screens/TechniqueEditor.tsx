import { useState } from "react";
import { CATEGORIES, TECHNIQUES, type CategoryId, type Technique, setTechniques } from "../../data/taekwondo";
import { saveResource, DEV_ONLY_MSG } from "../../hooks/useAdminSave";
import { DetailHeader } from "./DetailHeader";

export function TechniqueEditor({ editId, onSaved, onCancel }: {
  editId?: string;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const existing = editId ? TECHNIQUES.find(t => t.id === editId) : undefined;

  const [roman, setRoman]       = useState(existing?.roman    ?? "");
  const [hangul, setHangul]     = useState(existing?.hangul   ?? "");
  const [pt, setPt]             = useState(existing?.pt       ?? "");
  const [category, setCategory] = useState<CategoryId>(existing?.category ?? "seogi");
  const [note, setNote]         = useState(existing?.note     ?? "");
  const [saving, setSaving]     = useState(false);

  const canSave = roman.trim() && pt.trim() && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const fields: Technique = {
        id: editId ?? `custom-${Date.now()}`,
        roman: roman.trim(),
        hangul: hangul.trim(),
        pt: pt.trim(),
        category,
        note: note.trim() || undefined,
      };
      let updated: Technique[];
      if (editId) {
        updated = TECHNIQUES.map(t => t.id === editId ? fields : t);
      } else {
        updated = [...TECHNIQUES, fields];
      }
      await saveResource("techniques", updated);
      setTechniques(updated);
      onSaved(fields.id);
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DetailHeader onBack={onCancel} label={editId ? "Editar Técnica" : "Nova Técnica"} />
      <div className="px-4 flex flex-col gap-4">

        {/* Categoria */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Categoria *
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className="rounded-full px-4 py-2 font-display transition-colors"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: category === cat.id ? "var(--tkd-red)" : "var(--tkd-surface)",
                  color: category === cat.id ? "#fff" : "var(--tkd-text)",
                  border: `1px solid ${category === cat.id ? "var(--tkd-red)" : "var(--tkd-border)"}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Romanização */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Romanização *
          </label>
          <input
            type="text"
            placeholder="Ex: Naeryo Chagi"
            value={roman}
            onChange={e => setRoman(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 15 }}
          />
        </div>

        {/* Português */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Nome em Português *
          </label>
          <input
            type="text"
            placeholder="Ex: Pontapé descendente"
            value={pt}
            onChange={e => setPt(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 15 }}
          />
        </div>

        {/* Hangul */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Hangul (opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: 내려 차기"
            value={hangul}
            onChange={e => setHangul(e.target.value)}
            className="w-full rounded-xl px-4 py-3 font-kr"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 18 }}
          />
        </div>

        {/* Nota / descrição */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Descrição / execução (opcional)
          </label>
          <textarea
            placeholder="Como executar, pontos importantes..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl px-4 py-3 resize-none"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 14, lineHeight: 1.5 }}
          />
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="w-full rounded-xl py-3.5 font-display transition-opacity active:opacity-70"
          style={{
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: canSave ? "var(--tkd-red)" : "var(--tkd-border)",
            color: canSave ? "#fff" : "var(--tkd-muted)",
          }}
        >
          {saving ? "A guardar..." : (editId ? "Guardar alterações" : "Criar técnica")}
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
