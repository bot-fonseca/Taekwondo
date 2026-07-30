import { useState } from "react";
import { CATEGORIES, TECHNIQUES } from "../../data/taekwondo";
import { HANBEON, setHanbeon, type HanbeonStep } from "../../data/pratica";
import { saveResource, DEV_ONLY_MSG } from "../../hooks/useAdminSave";
import { DetailHeader } from "./DetailHeader";

const ROLES: { value: HanbeonStep["papel"]; label: string }[] = [
  { value: "atacante", label: "Atacante" },
  { value: "defensor", label: "Defensor" },
];

function newStep(): HanbeonStep {
  return { papel: "defensor", descricao: "", techniqueIds: [] };
}

function TechniqueMultiPicker({ values, onChange }: { values: string[]; onChange: (ids: string[]) => void }) {
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

export function HanbeonEditor({ editId, onSaved, onCancel }: {
  editId?: string;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const existing = editId ? HANBEON.find(h => h.id === editId) : undefined;

  const [ataque, setAtaque] = useState(existing?.ataque ?? "");
  const [passos, setPassos] = useState<HanbeonStep[]>(
    existing?.passos.length ? existing.passos : [newStep()]
  );
  const [saving, setSaving] = useState(false);

  const updateStep = (i: number, patch: Partial<HanbeonStep>) =>
    setPassos(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const addStep    = () => setPassos(prev => [...prev, newStep()]);
  const removeStep = (i: number) => setPassos(prev => prev.filter((_, idx) => idx !== i));
  const moveUp     = (i: number) => { if (i === 0) return; setPassos(prev => { const a=[...prev]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a; }); };
  const moveDown   = (i: number) => setPassos(prev => { if (i>=prev.length-1) return prev; const a=[...prev]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a; });

  const handleSave = async () => {
    if (!ataque.trim() || saving) return;
    setSaving(true);
    try {
      const entry = { id: editId ?? `hb-c-${Date.now()}`, numero: editId ? (existing?.numero ?? HANBEON.length + 1) : HANBEON.length + 1, ataque: ataque.trim(), passos };
      const updated = editId ? HANBEON.map(h => h.id === editId ? entry : h) : [...HANBEON, entry];
      await saveResource("hanbeon", updated);
      setHanbeon(updated);
      onSaved(entry.id);
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
    } finally { setSaving(false); }
  };

  return (
    <div>
      <DetailHeader onBack={onCancel} label={editId ? "Editar Hanbeon" : "Novo Hanbeon"} />
      <div className="px-4 flex flex-col gap-4">

        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Ataque *</label>
          <input type="text" placeholder="Ex: Soco ao rosto" value={ataque} onChange={e => setAtaque(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 15 }} />
        </div>

        <div>
          <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Passos</span>
          <div className="flex flex-col gap-3 mt-2">
            {passos.map((p, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold rounded-full flex items-center justify-center text-white"
                    style={{ width: 24, height: 24, fontSize: 12, background: p.papel === "atacante" ? "var(--tkd-red)" : "var(--tkd-blue)" }}>
                    {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveUp(i)} disabled={i===0} className="rounded-lg w-7 h-7 flex items-center justify-center" style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: i===0?0.3:1 }}>↑</button>
                    <button type="button" onClick={() => moveDown(i)} disabled={i===passos.length-1} className="rounded-lg w-7 h-7 flex items-center justify-center" style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: i===passos.length-1?0.3:1 }}>↓</button>
                    <button type="button" onClick={() => removeStep(i)} disabled={passos.length===1} className="rounded-lg w-7 h-7 flex items-center justify-center" style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: passos.length===1?0.3:1 }}>✕</button>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  {ROLES.map(r => (
                    <button key={r.value} type="button" onClick={() => updateStep(i, { papel: r.value })}
                      className="rounded-lg px-3 py-1.5 font-display transition-colors"
                      style={{ fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase",
                        background: p.papel === r.value ? (r.value === "atacante" ? "var(--tkd-red)" : "var(--tkd-blue)") : "var(--tkd-bg)",
                        color: p.papel === r.value ? "#fff" : "var(--tkd-muted)",
                        border: "1px solid var(--tkd-border)" }}>
                      {r.label}
                    </button>
                  ))}
                </div>

                <input type="text" placeholder="Descrição do movimento" value={p.descricao} onChange={e => updateStep(i, { descricao: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 mb-2"
                  style={{ background: "var(--tkd-bg)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 14 }} />

                <label className="font-display block mb-1" style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Técnicas associadas</label>
                <TechniqueMultiPicker values={p.techniqueIds ?? []} onChange={ids => updateStep(i, { techniqueIds: ids })} />
              </div>
            ))}
          </div>
          <button type="button" onClick={addStep} className="w-full mt-3 rounded-xl py-3 font-display"
            style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px dashed var(--tkd-border)" }}>
            + Adicionar passo
          </button>
        </div>

        <button type="button" onClick={handleSave} disabled={!ataque.trim()} className="w-full rounded-xl py-3.5 font-display"
          style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
            background: ataque.trim() ? "var(--tkd-red)" : "var(--tkd-border)",
            color: ataque.trim() ? "#fff" : "var(--tkd-muted)" }}>
          {saving ? "A guardar..." : (editId ? "Guardar alterações" : "Criar Hanbeon")}
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
