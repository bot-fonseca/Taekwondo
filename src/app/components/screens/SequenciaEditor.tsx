import { useState } from "react";
import { useSequencias } from "../../hooks/useSequencias";
import { TECHNIQUES, CATEGORIES } from "../../data/taekwondo";
import { SEQUENCIAS, BELTS, type SequenciaStep } from "../../data/pratica";
import { BeltStrip } from "../BeltStrip";
import { DetailHeader } from "./DetailHeader";

function newStep(): SequenciaStep {
  return { id: crypto.randomUUID(), descricao: "", nota: "", techniqueId: undefined };
}

function TechniquePicker({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange(e.target.value || undefined)}
      className="w-full rounded-xl px-3 py-2"
      style={{
        background: "var(--tkd-bg)",
        border: "1px solid var(--tkd-border)",
        color: value ? "var(--tkd-text)" : "var(--tkd-muted)",
        fontSize: 13,
      }}
    >
      <option value="">— Sem técnica associada —</option>
      {CATEGORIES.map(cat => (
        <optgroup key={cat.id} label={`${cat.label} (${cat.roman})`}>
          {TECHNIQUES.filter(t => t.category === cat.id).map(t => (
            <option key={t.id} value={t.id}>
              {t.pt} · {t.roman}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export function SequenciaEditor({ editId, prefillBelt, onSaved, onCancel }: {
  editId?: string;
  prefillBelt?: string;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const { criar, editar } = useSequencias();
  const existing = editId ? SEQUENCIAS.find(s => s.id === editId) : undefined;

  const [nome, setNome]         = useState(existing?.nome ?? "");
  const [descricao, setDescricao] = useState(existing?.descricao ?? "");
  const [belt, setBelt]           = useState(existing?.belt ?? prefillBelt ?? "");
  const [passos, setPassos]       = useState<SequenciaStep[]>(
    existing?.passos.length ? existing.passos : [newStep()]
  );
  const [saving, setSaving] = useState(false);

  const updateStep = (idx: number, patch: Partial<SequenciaStep>) => {
    setPassos(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  };
  const addStep = () => setPassos(prev => [...prev, newStep()]);
  const removeStep = (idx: number) => setPassos(prev => prev.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPassos(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx: number) => {
    setPassos(prev => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  };

  const handleSave = async () => {
    if (!nome.trim() || saving) return;
    setSaving(true);
    const limpos = passos.filter(p => p.descricao.trim());
    try {
      if (editId) {
        await editar(editId, nome.trim(), descricao.trim(), limpos, belt || undefined);
        onSaved(editId);
      } else {
        const nova = await criar(nome.trim(), descricao.trim(), limpos, belt || undefined);
        onSaved(nova.id);
      }
    } catch (err: any) {
      alert(err.message ?? String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DetailHeader onBack={onCancel} label={editId ? "Editar Sequência" : "Nova Sequência"} />
      <div className="px-4 flex flex-col gap-4">

        {/* Nome */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Nome *
          </label>
          <input
            type="text"
            placeholder="Ex: Combinação básica 1"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 15 }}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
            Descrição (opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Para treino de grau azul"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 14 }}
          />
        </div>

        {/* Cinto */}
        <div>
          <label className="font-display block mb-1.5" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>Cinto</label>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setBelt("")}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-display transition-colors"
              style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", background: !belt ? "var(--tkd-surface)" : "transparent", color: !belt ? "var(--tkd-text)" : "var(--tkd-muted)", border: `1px solid ${!belt ? "var(--tkd-muted)" : "var(--tkd-border)"}` }}>
              Nenhum
            </button>
            {BELTS.map(b => (
              <button key={b.id} type="button" onClick={() => setBelt(b.id)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-display transition-colors"
                style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", background: belt === b.id ? b.color + "22" : "transparent", color: belt === b.id ? b.color : "var(--tkd-muted)", border: `1px solid ${belt === b.id ? b.color : "var(--tkd-border)"}` }}>
                <BeltStrip color={b.color} stripe={b.stripe} width={22} height={6} />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Passos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
              Passos
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {passos.map((passo, idx) => (
              <div
                key={passo.id}
                className="rounded-2xl p-4"
                style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
              >
                {/* Step header */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-display font-bold rounded-full flex items-center justify-center text-white"
                    style={{ width: 24, height: 24, fontSize: 12, background: "var(--tkd-red)" }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0}
                      className="rounded-lg w-7 h-7 flex items-center justify-center transition-opacity"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: idx === 0 ? 0.3 : 1 }}
                    >↑</button>
                    <button type="button" onClick={() => moveDown(idx)} disabled={idx === passos.length - 1}
                      className="rounded-lg w-7 h-7 flex items-center justify-center transition-opacity"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: idx === passos.length - 1 ? 0.3 : 1 }}
                    >↓</button>
                    <button type="button" onClick={() => removeStep(idx)} disabled={passos.length === 1}
                      className="rounded-lg w-7 h-7 flex items-center justify-center transition-opacity"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: passos.length === 1 ? 0.3 : 1 }}
                    >✕</button>
                  </div>
                </div>

                {/* Técnica */}
                <div className="mb-2">
                  <label className="font-display block mb-1" style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
                    Técnica
                  </label>
                  <TechniquePicker
                    value={passo.techniqueId}
                    onChange={tid => {
                      const t = tid ? TECHNIQUES.find(x => x.id === tid) : null;
                      updateStep(idx, {
                        techniqueId: tid,
                        descricao: passo.descricao || (t ? t.pt : ""),
                      });
                    }}
                  />
                </div>

                {/* Descrição do passo */}
                <div className="mb-2">
                  <label className="font-display block mb-1" style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
                    Descrição *
                  </label>
                  <input
                    type="text"
                    placeholder="O que fazer neste passo"
                    value={passo.descricao}
                    onChange={e => updateStep(idx, { descricao: e.target.value })}
                    className="w-full rounded-xl px-3 py-2"
                    style={{ background: "var(--tkd-bg)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 14 }}
                  />
                </div>

                {/* Nota */}
                <div>
                  <label className="font-display block mb-1" style={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
                    Nota (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Dica, variante, observação..."
                    value={passo.nota ?? ""}
                    onChange={e => updateStep(idx, { nota: e.target.value })}
                    className="w-full rounded-xl px-3 py-2"
                    style={{ background: "var(--tkd-bg)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)", fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addStep}
            className="w-full mt-3 rounded-xl py-3 font-display transition-opacity active:opacity-70"
            style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px dashed var(--tkd-border)" }}
          >
            + Adicionar passo
          </button>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!nome.trim() || saving}
          className="w-full rounded-xl py-3.5 font-display transition-opacity active:opacity-70"
          style={{
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: nome.trim() ? "var(--tkd-red)" : "var(--tkd-border)",
            color: nome.trim() ? "#fff" : "var(--tkd-muted)",
          }}
        >
          {saving ? "A guardar..." : (editId ? "Guardar alterações" : "Criar sequência")}
        </button>

        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
