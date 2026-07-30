// ── Tipos e dados para Hanbeon Kyorugi, Ho Shin Sul e Sequências ────────────
// Os dados editáveis estão em hanbeon.json e hoshin.json — editar via admin mode.

import hanbeonJson   from "./hanbeon.json";
import hoshinJson    from "./hoshin.json";
import sequencesJson from "./sequences.json";

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
  passos: SequenciaStep[];
  criadaEm: number;
}

export let SEQUENCIAS: Sequencia[] = sequencesJson as Sequencia[];
export function setSequencias(data: Sequencia[]) { SEQUENCIAS = data; }
