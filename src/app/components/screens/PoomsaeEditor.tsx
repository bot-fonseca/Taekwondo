import { useState } from "react";
import { POOMSAE, setPoomsae, type Poomsae, type PoomsaeStep } from "../../data/taekwondo";
import { BELTS } from "../../data/pratica";
import { saveResource, DEV_ONLY_MSG } from "../../hooks/useAdminSave";
import { BeltStrip } from "../BeltStrip";
import { DetailHeader } from "./DetailHeader";

const TRIGRAMS_LIST = [
  { g: "☰", name: "Keon (Céu)" },
  { g: "☱", name: "Tae (Lago)" },
  { g: "☲", name: "Ri (Fogo)" },
  { g: "☳", name: "Jin (Trovão)" },
  { g: "☴", name: "Seon (Vento)" },
  { g: "☵", name: "Gam (Água)" },
  { g: "☶", name: "Gan (Montanha)" },
  { g: "☷", name: "Gon (Terra)" },
];

function newStep(n: number): PoomsaeStep {
  return { n, technique: "", hangul: "", detail: "" };
}

export function PoomsaeEditor({ editId, onSaved, onCancel }: {
  editId?: string;
  onSaved: (id: string) => void;
  onCancel: () => void;
}) {
  const existing = editId ? POOMSAE.find(p => p.id === editId) : undefined;

  const [group, setGroup]         = useState<"Taeguk" | "Palgwe">(existing?.group ?? "Taeguk");
  const [name, setName]           = useState(existing?.name ?? "");
  const [hangul, setHangul]       = useState(existing?.hangul ?? "");
  const [trigram, setTrigram]     = useState(existing?.trigram ?? "☰");
  const [trigramName, setTrigramName] = useState(existing?.trigramName ?? "Keon (Céu)");
  const [meaning, setMeaning]     = useState(existing?.meaning ?? "");
  const [steps, setSteps]         = useState<PoomsaeStep[]>(
    existing?.steps.length ? existing.steps : [newStep(1)]
  );
  const [image, setImage]         = useState(existing?.image ?? "");
  const [belt, setBelt]           = useState(existing?.belt ?? "");
  const [saving, setSaving]       = useState(false);

  const updateStep = (i: number, patch: Partial<PoomsaeStep>) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));

  const addStep = () => setSteps(prev => [...prev, newStep(prev.length + 1)]);

  const removeStep = (i: number) => setSteps(prev =>
    prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, n: idx + 1 }))
  );

  const moveUp = (i: number) => {
    if (i === 0) return;
    setSteps(prev => {
      const a = [...prev];
      [a[i - 1], a[i]] = [a[i], a[i - 1]];
      return a.map((s, idx) => ({ ...s, n: idx + 1 }));
    });
  };

  const moveDown = (i: number) => setSteps(prev => {
    if (i >= prev.length - 1) return prev;
    const a = [...prev];
    [a[i], a[i + 1]] = [a[i + 1], a[i]];
    return a.map((s, idx) => ({ ...s, n: idx + 1 }));
  });

  const handleTrigramChange = (g: string) => {
    setTrigram(g);
    const found = TRIGRAMS_LIST.find(t => t.g === g);
    if (found) setTrigramName(found.name);
  };

  const canSave = name.trim() !== "" && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const id = editId ?? `custom-${Date.now()}`;
      const idx = editId
        ? (existing?.index ?? POOMSAE.filter(p => p.group === group).length + 1)
        : POOMSAE.filter(p => p.group === group).length + 1;
      const entry: Poomsae = {
        id,
        group,
        index: idx,
        name: name.trim(),
        hangul: hangul.trim(),
        trigram,
        trigramName,
        meaning: meaning.trim(),
        moves: steps.length,
        belt: belt || undefined,
        image: image.trim() || undefined,
        steps: steps.map((s, i) => ({ ...s, n: i + 1 })),
      };
      const updated = editId
        ? POOMSAE.map(p => p.id === editId ? entry : p)
        : [...POOMSAE, entry];
      await saveResource("poomsae", updated);
      setPoomsae(updated);
      onSaved(entry.id);
    } catch (err: any) {
      alert(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
    } finally {
      setSaving(false);
    }
  };

  const labelStyle = { fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "var(--tkd-muted)" };
  const inputStyle = { background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)" };
  const innerInputStyle = { background: "var(--tkd-bg)", border: "1px solid var(--tkd-border)", color: "var(--tkd-text)" };

  return (
    <div>
      <DetailHeader onBack={onCancel} label={editId ? "Editar Poomsae" : "Nova Poomsae"} />
      <div className="px-4 flex flex-col gap-4">

        {/* Grupo */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Grupo *</label>
          <div className="flex gap-2">
            {(["Taeguk", "Palgwe"] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className="flex-1 rounded-xl py-2.5 font-display transition-colors"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: group === g ? "var(--tkd-blue)" : "var(--tkd-surface)",
                  color: group === g ? "#fff" : "var(--tkd-muted)",
                  border: `1px solid ${group === g ? "var(--tkd-blue)" : "var(--tkd-border)"}`,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Nome *</label>
          <input
            type="text"
            placeholder="Ex: Taeguk 1 Jang"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ ...inputStyle, fontSize: 15 }}
          />
        </div>

        {/* Hangul */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Hangul</label>
          <input
            type="text"
            placeholder="Ex: 태극 일장"
            value={hangul}
            onChange={e => setHangul(e.target.value)}
            className="w-full rounded-xl px-4 py-3 font-kr"
            style={{ ...inputStyle, fontSize: 18 }}
          />
        </div>

        {/* Trigrama */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Trigrama</label>
          <div className="flex flex-wrap gap-2">
            {TRIGRAMS_LIST.map(t => (
              <button
                key={t.g}
                type="button"
                onClick={() => handleTrigramChange(t.g)}
                className="rounded-xl px-3 py-2 flex items-center gap-2 transition-colors"
                style={{
                  background: trigram === t.g ? "var(--tkd-blue-soft)" : "var(--tkd-surface)",
                  border: `1px solid ${trigram === t.g ? "var(--tkd-blue)" : "var(--tkd-border)"}`,
                }}
              >
                <span style={{ fontSize: 18 }}>{t.g}</span>
                <span style={{ fontSize: 11, color: trigram === t.g ? "var(--tkd-blue)" : "var(--tkd-muted)" }}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cinto */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Cinto</label>
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

        {/* Significado */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Significado</label>
          <textarea
            placeholder="Significado e simbolismo desta poomsae..."
            value={meaning}
            onChange={e => setMeaning(e.target.value)}
            rows={3}
            className="w-full rounded-xl px-4 py-3 resize-none"
            style={{ ...inputStyle, fontSize: 14, lineHeight: 1.5 }}
          />
        </div>

        {/* Imagem */}
        <div>
          <label className="font-display block mb-1.5" style={labelStyle}>Imagem (opcional)</label>
          <input
            type="text"
            placeholder="Ex: taeguk-1.jpg  (coloca o ficheiro em public/images/poomsae/)"
            value={image}
            onChange={e => setImage(e.target.value)}
            className="w-full rounded-xl px-4 py-3"
            style={{ ...inputStyle, fontSize: 13 }}
          />
          {image.trim() && (
            <img
              src={`/images/poomsae/${image.trim()}`}
              alt="pré-visualização"
              className="w-full rounded-xl mt-2"
              style={{ maxHeight: 200, objectFit: "contain", background: "var(--tkd-bg)" }}
              onError={e => (e.currentTarget.style.display = "none")}
              onLoad={e => (e.currentTarget.style.display = "")}
            />
          )}
        </div>

        {/* Passos */}
        <div>
          <span className="font-display" style={labelStyle}>
            Passos ({steps.length} movimentos)
          </span>
          <div className="flex flex-col gap-3 mt-2">
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-display font-bold rounded-full flex items-center justify-center"
                    style={{ width: 28, height: 28, fontSize: 13, background: "var(--tkd-blue-soft)", border: "1px solid rgba(43,90,130,0.4)", color: "var(--tkd-text)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                      className="rounded-lg w-7 h-7 flex items-center justify-center"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                    <button type="button" onClick={() => moveDown(i)} disabled={i === steps.length - 1}
                      className="rounded-lg w-7 h-7 flex items-center justify-center"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: i === steps.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button type="button" onClick={() => removeStep(i)} disabled={steps.length === 1}
                      className="rounded-lg w-7 h-7 flex items-center justify-center"
                      style={{ background: "var(--tkd-bg)", color: "var(--tkd-muted)", opacity: steps.length === 1 ? 0.3 : 1 }}>✕</button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Técnica (ex: Ap Seogi + Arae Makgi)"
                  value={s.technique}
                  onChange={e => updateStep(i, { technique: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 mb-2"
                  style={{ ...innerInputStyle, fontSize: 14 }}
                />
                <input
                  type="text"
                  placeholder="Hangul (ex: 앞 서기 / 아래 막기)"
                  value={s.hangul}
                  onChange={e => updateStep(i, { hangul: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 mb-2 font-kr"
                  style={{ ...innerInputStyle, fontSize: 14 }}
                />
                <input
                  type="text"
                  placeholder="Detalhe (ex: Vira à esquerda, bloqueio baixo)"
                  value={s.detail}
                  onChange={e => updateStep(i, { detail: e.target.value })}
                  className="w-full rounded-xl px-3 py-2"
                  style={{ ...innerInputStyle, fontSize: 13 }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="w-full mt-3 rounded-xl py-3 font-display"
            style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", color: "var(--tkd-muted)", border: "1px dashed var(--tkd-border)" }}
          >
            + Adicionar passo
          </button>
        </div>

        {/* Guardar */}
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
          {saving ? "A guardar..." : (editId ? "Guardar alterações" : "Criar poomsae")}
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
