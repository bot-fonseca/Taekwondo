import { useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { CATEGORIES, TECHNIQUES, type CategoryId, type Technique } from "../../data/taekwondo";
import {
  answerText, buildOptions, loadProgress, pickNext, recordAnswer, saveProgress,
  MASTERED_BOX, type FlashMode, type Progress,
} from "../../data/flashcards";
import { HangulPair } from "../atoms";
import { DetailHeader } from "./DetailHeader";

type Filter = CategoryId | "all";
type Round = { card: Technique; options: Technique[] } | null;

const chipStyle = (active: boolean) => ({
  fontSize: 11,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  background: active ? "var(--tkd-blue)" : "transparent",
  color: active ? "#fff" : "var(--tkd-muted)",
  border: `1px solid ${active ? "var(--tkd-blue)" : "var(--tkd-border)"}`,
});

function poolFor(filter: Filter) {
  return filter === "all" ? TECHNIQUES : TECHNIQUES.filter(t => t.category === filter);
}

function makeRound(filter: Filter, mode: FlashMode, progress: Progress, lastId?: string): Round {
  const pool = poolFor(filter);
  if (pool.length < 2) return null;
  const card = pickNext(pool, progress, lastId);
  return { card, options: buildOptions(card, pool, mode) };
}

export function FlashcardsScreen({ onBack, onOpenTechnique }: {
  onBack: () => void;
  onOpenTechnique: (id: string) => void;
}) {
  const [mode, setMode] = useState<FlashMode>("descricao");
  const [filter, setFilter] = useState<Filter>("all");
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [round, setRound] = useState<Round>(() => makeRound("all", "descricao", progress));
  const [chosen, setChosen] = useState<string | null>(null);
  const [session, setSession] = useState({ right: 0, total: 0 });

  const pool = poolFor(filter);
  const mastered = pool.filter(t => (progress[t.id] ?? 0) >= MASTERED_BOX).length;

  function restart(f: Filter, m: FlashMode) {
    setFilter(f);
    setMode(m);
    setChosen(null);
    setRound(makeRound(f, m, progress));
  }

  function answer(id: string) {
    if (!round || chosen) return;
    const correct = id === round.card.id;
    const next = recordAnswer(progress, round.card.id, correct);
    setProgress(next);
    saveProgress(next);
    setChosen(id);
    setSession(s => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
  }

  function nextCard() {
    setChosen(null);
    setRound(makeRound(filter, mode, progress, round?.card.id));
  }

  function resetProgress() {
    if (!window.confirm("Repor o progresso de todas as flashcards?")) return;
    setProgress({});
    saveProgress({});
    setSession({ right: 0, total: 0 });
  }

  const card = round?.card;
  const isRight = chosen !== null && chosen === card?.id;

  return (
    <div>
      <DetailHeader onBack={onBack} label="Início" />
      <div className="px-4 pb-4">
        <div className="flex items-baseline gap-2 mb-4">
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}>
            Flashcards
          </h1>
          <span className="font-kr" style={{ fontSize: 14, color: "var(--tkd-muted)" }}>용어 연습</span>
        </div>

        {/* Modo */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {([["descricao", "Descrição → Nome"], ["nome", "Nome → Descrição"]] as const).map(([m, label]) => (
            <button key={m} type="button" onClick={() => restart(filter, m)}
              className="rounded-lg px-2 py-2 font-display transition-colors" style={chipStyle(mode === m)}>
              {label}
            </button>
          ))}
        </div>

        {/* Categoria */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {([{ id: "all", label: "Todas" }, ...CATEGORIES] as { id: Filter; label: string }[]).map(c => (
            <button key={c.id} type="button" onClick={() => restart(c.id, mode)}
              className="rounded-lg px-2.5 py-1.5 font-display transition-colors" style={chipStyle(filter === c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between mb-1" style={{ fontSize: 12, color: "var(--tkd-muted)" }}>
            <span>Dominadas: {mastered}/{pool.length}</span>
            {session.total > 0 && <span>Sessão: {session.right}/{session.total} certas</span>}
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--tkd-surface-2)" }}>
            <div style={{ height: "100%", width: `${pool.length ? (mastered / pool.length) * 100 : 0}%`, background: "var(--tkd-green)", transition: "width 0.3s" }} />
          </div>
        </div>

        {!round || !card ? (
          <p className="text-center py-10" style={{ color: "var(--tkd-muted)" }}>
            São precisas pelo menos 2 técnicas nesta categoria.
          </p>
        ) : (
          <>
            {/* Pergunta */}
            <div className="rounded-2xl px-5 py-6 mb-4 text-center"
              style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)", minHeight: 130 }}>
              <p className="font-display mb-3" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
                {mode === "descricao" ? "Qual é o nome desta técnica?" : "O que significa?"}
              </p>
              {mode === "descricao" ? (
                <>
                  <p style={{ fontSize: 21, fontWeight: 600, color: "var(--tkd-text)", lineHeight: 1.3 }}>{card.pt}</p>
                  {card.note && <p className="mt-2" style={{ fontSize: 14, color: "var(--tkd-muted)" }}>{card.note}</p>}
                </>
              ) : (
                <div className="flex justify-center"><HangulPair hangul={card.hangul} roman={card.roman} size="lg" /></div>
              )}
            </div>

            {/* Opções */}
            <div className="flex flex-col gap-2 mb-4">
              {round.options.map(o => {
                const showRight = chosen !== null && o.id === card.id;
                const showWrong = chosen === o.id && o.id !== card.id;
                return (
                  <button key={o.id} type="button" onClick={() => answer(o.id)} disabled={chosen !== null}
                    className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-colors"
                    style={{
                      background: showRight ? "var(--tkd-green-soft)" : showWrong ? "var(--tkd-red-soft)" : "var(--tkd-surface)",
                      border: `1px solid ${showRight ? "var(--tkd-green)" : showWrong ? "var(--tkd-red)" : "var(--tkd-border)"}`,
                      opacity: chosen !== null && !showRight && !showWrong ? 0.55 : 1,
                    }}>
                    <div className="flex-1 min-w-0">
                      {mode === "descricao"
                        ? <HangulPair hangul={o.hangul} roman={o.roman} size="sm" />
                        : <span style={{ fontSize: 15, color: "var(--tkd-text)" }}>{answerText(o, mode)}</span>}
                    </div>
                    {showRight && <Check size={20} color="var(--tkd-green)" />}
                    {showWrong && <X size={20} color="var(--tkd-red)" />}
                  </button>
                );
              })}
            </div>

            {/* Resultado */}
            {chosen !== null && (
              <div className="rounded-xl px-4 py-3 mb-4"
                style={{ background: isRight ? "var(--tkd-green-soft)" : "var(--tkd-red-soft)", border: `1px solid ${isRight ? "var(--tkd-green)" : "var(--tkd-red)"}` }}>
                <p className="font-display mb-1" style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: isRight ? "var(--tkd-green)" : "var(--tkd-red)" }}>
                  {isRight ? "Certo!" : "Errado"}
                </p>
                <p style={{ fontSize: 14, color: "var(--tkd-text)" }}>
                  <span className="font-kr">{card.hangul}</span> · <strong>{card.roman}</strong> — {card.pt}
                </p>
                {mode === "nome" && card.note && <p className="mt-1" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{card.note}</p>}
                <div className="flex gap-2 mt-3">
                  <button type="button" onClick={() => onOpenTechnique(card.id)}
                    className="rounded-lg px-3 py-2 font-display" style={{ ...chipStyle(false), color: "var(--tkd-text)" }}>
                    Ver técnica
                  </button>
                  <button type="button" onClick={nextCard}
                    className="flex-1 rounded-lg px-3 py-2 font-display" style={{ ...chipStyle(true), background: "var(--tkd-red)", border: "1px solid var(--tkd-red)", fontSize: 13 }}>
                    Seguinte →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <button type="button" onClick={resetProgress}
          className="inline-flex items-center gap-1.5 mt-2 py-1" style={{ fontSize: 12, color: "var(--tkd-muted)" }}>
          <RotateCcw size={13} /> Repor progresso
        </button>
      </div>
    </div>
  );
}
