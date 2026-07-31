// ── Tipos e dados para Hanbeon Kyorugi, Ho Shin Sul e Sequências ────────────
// Os dados editáveis estão em hanbeon.json e hoshin.json — editar via admin mode.

import hanbeonJson   from "./hanbeon.json";
import hoshinJson    from "./hoshin.json";
import sequencesJson from "./sequences.json";

// ── Cintos (띠) ──────────────────────────────────────────────────────────────
export interface Belt {
  id: string;
  label: string;
  korean: string;
  roman: string;
  color: string;
  stripe?: string;   // cor da lista para cintos intermédios
}

export const BELTS: Belt[] = [
  { id: "branco",         label: "Branco",          korean: "흰 띠",       roman: "Huin Ti",           color: "#C9CDD4" },
  { id: "branco-amarelo", label: "Branco-Amarelo",  korean: "흰노란 띠",   roman: "Huin-Noran Ti",     color: "#C9CDD4", stripe: "#F59E0B" },
  { id: "amarelo",        label: "Amarelo",          korean: "노란 띠",     roman: "Noran Ti",          color: "#F59E0B" },
  { id: "amarelo-verde",  label: "Amarelo-Verde",   korean: "노란초록 띠",  roman: "Noran-Chorok Ti",   color: "#F59E0B", stripe: "#22C55E" },
  { id: "verde",          label: "Verde",            korean: "초록 띠",     roman: "Chorok Ti",         color: "#22C55E" },
  { id: "verde-azul",     label: "Verde-Azul",      korean: "초록파란 띠",  roman: "Chorok-Paran Ti",   color: "#22C55E", stripe: "#3B82F6" },
  { id: "azul",           label: "Azul",             korean: "파란 띠",     roman: "Paran Ti",          color: "#3B82F6" },
  { id: "azul-vermelho",  label: "Azul-Vermelho",   korean: "파란빨간 띠",  roman: "Paran-Ppalgan Ti",  color: "#3B82F6", stripe: "#EF4444" },
  { id: "vermelho",        label: "Vermelho",         korean: "빨간 띠",     roman: "Ppalgan Ti",        color: "#EF4444" },
  { id: "vermelho-preto",  label: "Vermelho-Preto",  korean: "빨간검은 띠",  roman: "Ppalgan-Geomeun Ti", color: "#EF4444", stripe: "#374151" },
  { id: "preto",          label: "Preto",            korean: "검은 띠",     roman: "Geomeun Ti",        color: "#374151" },
];

// ── Hanbeon Kyorugi (一番競技) ────────────────────────────────────────────────
export interface HanbeonStep {
  papel: "atacante" | "defensor";
  descricao: string;
  techniqueIds?: string[];
}

export interface HanbeonKyorugi {
  id: string;
  numero: number;
  ataque: string;
  belt?: string;
  passos: HanbeonStep[];
}

export let HANBEON: HanbeonKyorugi[] = hanbeonJson as HanbeonKyorugi[];
export function setHanbeon(data: HanbeonKyorugi[]) { HANBEON = data; }

// ── Ho Shin Sul (護身術) ─────────────────────────────────────────────────────
export interface HoShinSulStep {
  descricao: string;
  techniqueIds?: string[];
}

export interface HoShinSul {
  id: string;
  situacao: string;
  belt?: string;
  passos: HoShinSulStep[];
}

export let HO_SHIN_SUL: HoShinSul[] = hoshinJson as HoShinSul[];
export function setHoShinSul(data: HoShinSul[]) { HO_SHIN_SUL = data; }

// ── Sequências ───────────────────────────────────────────────────────────────
export interface SequenciaStep {
  id: string;
  techniqueId?: string;
  descricao: string;
  nota?: string;
}

export interface Sequencia {
  id: string;
  nome: string;
  descricao?: string;
  belt?: string;
  passos: SequenciaStep[];
  criadaEm: number;
}

export let SEQUENCIAS: Sequencia[] = sequencesJson as Sequencia[];
export function setSequencias(data: Sequencia[]) { SEQUENCIAS = data; }
