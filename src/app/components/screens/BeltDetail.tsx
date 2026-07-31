import { BELTS, HANBEON, HO_SHIN_SUL, SEQUENCIAS } from "../../data/pratica";
import { POOMSAE } from "../../data/taekwondo";
import { BeltStrip } from "../BeltStrip";
import { Trigram } from "../Trigram";
import { useAdmin } from "../../context/AdminContext";
import { DetailHeader } from "./DetailHeader";

type BeltDetailProps = {
  beltId: string;
  onBack: () => void;
  onOpenPoomsae: (id: string) => void;
  onOpenHanbeon: (id: string) => void;
  onOpenHoShin: (id: string) => void;
  onOpenSeq: (id: string) => void;
  onNovoHanbeon: () => void;
  onNovoHoShin: () => void;
  onNovaSeq: () => void;
};

export function BeltDetail({
  beltId, onBack,
  onOpenPoomsae,
  onOpenHanbeon, onOpenHoShin, onOpenSeq,
  onNovoHanbeon, onNovoHoShin, onNovaSeq,
}: BeltDetailProps) {
  const { isAdmin } = useAdmin();
  const belt = BELTS.find(b => b.id === beltId);
  if (!belt) return null;

  const poomsaeList = POOMSAE.filter(p => p.belt === beltId);
  const hanbeonList = HANBEON.filter(h => h.belt === beltId);
  const hoshinList  = HO_SHIN_SUL.filter(h => h.belt === beltId);
  const seqList     = SEQUENCIAS.filter(s => s.belt === beltId);

  const labelStyle = {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--tkd-muted)",
  };

  function Section({
    title,
    korean,
    items,
    onOpen,
    onNovo,
  }: {
    title: string;
    korean: string;
    items: { id: string; label: string }[];
    onOpen: (id: string) => void;
    onNovo: () => void;
  }) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display" style={labelStyle}>{title}</span>
            <span className="font-kr" style={{ fontSize: 12, color: "var(--tkd-muted)", opacity: 0.6 }}>{korean}</span>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={onNovo}
              className="rounded-lg px-2.5 py-1 font-display transition-opacity active:opacity-70"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "var(--tkd-red)",
                color: "#fff",
              }}
            >
              + Novo
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--tkd-muted)", fontStyle: "italic", paddingLeft: 4 }}>
            {isAdmin
              ? "Sem exercícios. Usa o botão + Novo para adicionar."
              : "Sem exercícios para este cinto."}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item.id)}
                className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity active:opacity-70"
                style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
              >
                <div
                  className="shrink-0 rounded-full"
                  style={{ width: 4, height: 30, background: belt.color }}
                />
                <span style={{ fontSize: 14, color: "var(--tkd-text)", flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 18, color: "var(--tkd-muted)" }}>›</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <DetailHeader onBack={onBack} label="Prática" />
      <div className="px-4">

        {/* Belt header */}
        <div
          className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-4"
          style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
        >
          <BeltStrip color={belt.color} stripe={belt.stripe} width={56} height={10} vertical />
          <div className="flex-1">
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--tkd-text)" }}>{belt.label}</p>
            <p className="font-kr" style={{ fontSize: 14, color: "var(--tkd-muted)" }}>
              {belt.korean} · {belt.roman}
            </p>
          </div>
          <span
            className="font-display"
            style={{ fontSize: 12, color: belt.color, background: belt.color + "18", border: `1px solid ${belt.color}44`, borderRadius: 8, padding: "4px 10px" }}
          >
            {hanbeonList.length + hoshinList.length + seqList.length} exercícios
          </span>
        </div>

        {/* Poomsae */}
        {poomsaeList.length > 0 && (
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display" style={labelStyle}>Poomsae</span>
              <span className="font-kr" style={{ fontSize: 12, color: "var(--tkd-muted)", opacity: 0.6 }}>품새</span>
            </div>
            <div className="flex flex-col gap-2">
              {poomsaeList.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpenPoomsae(p.id)}
                  className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity active:opacity-70"
                  style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
                >
                  <Trigram glyph={p.trigram} size={28} color="var(--tkd-text)" />
                  <div className="flex-1 min-w-0">
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tkd-text)" }}>{p.name}</span>
                    <span className="font-kr" style={{ fontSize: 12, color: "var(--tkd-muted)", display: "block" }}>{p.hangul}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--tkd-muted)" }}>{p.moves} mov.</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Section
          title="Hanbeon Kyorugi"
          korean="한번겨루기"
          items={hanbeonList.map(h => ({ id: h.id, label: `#${h.numero} · ${h.ataque}` }))}
          onOpen={onOpenHanbeon}
          onNovo={onNovoHanbeon}
        />
        <Section
          title="Ho Shin Sul"
          korean="호신술"
          items={hoshinList.map(h => ({ id: h.id, label: h.situacao }))}
          onOpen={onOpenHoShin}
          onNovo={onNovoHoShin}
        />
        <Section
          title="Sequências"
          korean="순서"
          items={seqList.map(s => ({ id: s.id, label: s.nome }))}
          onOpen={onOpenSeq}
          onNovo={onNovaSeq}
        />
      </div>
    </div>
  );
}
