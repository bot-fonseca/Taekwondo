// ── Flashcards: nome ↔ descrição das técnicas ───────────────────────────────
// Repetição espaçada simples (caixas de Leitner): cada técnica tem uma caixa 0–5.
// Certo → sobe uma caixa; errado → volta à 0. Caixas baixas saem mais vezes.
// O progresso fica no browser (localStorage).

import type { Technique } from "./taekwondo";

export type FlashMode = "descricao" | "nome";   // o que é mostrado na pergunta

export const MAX_BOX = 5;
export const MASTERED_BOX = 3;                    // a partir daqui conta como "dominada"

const KEY = "tkd_flashcards_v1";

export type Progress = Record<string, number>;  // techniqueId → caixa

export function loadProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* sem storage */ }
}

export function recordAnswer(p: Progress, id: string, correct: boolean): Progress {
  return { ...p, [id]: correct ? Math.min((p[id] ?? 0) + 1, MAX_BOX) : 0 };
}

/** Escolhe a próxima técnica: peso 2^(MAX_BOX - caixa), nunca a mesma duas vezes seguidas. */
export function pickNext(pool: Technique[], p: Progress, lastId?: string): Technique {
  const candidates = pool.length > 1 ? pool.filter(t => t.id !== lastId) : pool;
  const weights = candidates.map(t => 2 ** (MAX_BOX - (p[t.id] ?? 0)));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r < 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/** Texto da resposta para o modo — é o que tem de ser único entre as opções. */
export function answerText(t: Technique, mode: FlashMode) {
  return mode === "descricao" ? t.roman : t.pt;
}

function shuffle<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Até 4 opções (a certa + distractores), preferindo técnicas da mesma categoria. */
export function buildOptions(card: Technique, all: Technique[], mode: FlashMode): Technique[] {
  const key = (t: Technique) => answerText(t, mode).trim().toLowerCase();
  // texto da pergunta: uma técnica com a mesma pergunta (ex: entrada duplicada) também seria resposta certa
  const ask = (t: Technique) => answerText(t, mode === "descricao" ? "nome" : "descricao").trim().toLowerCase();
  const used = new Set([key(card)]);
  const picked: Technique[] = [];
  const sameCat = shuffle(all.filter(t => t.category === card.category));
  const others  = shuffle(all.filter(t => t.category !== card.category));
  for (const t of [...sameCat, ...others]) {
    if (picked.length === 3) break;
    if (used.has(key(t)) || ask(t) === ask(card)) continue;
    used.add(key(t));
    picked.push(t);
  }
  return shuffle([card, ...picked]);
}
