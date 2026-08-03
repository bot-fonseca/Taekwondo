// ── Dados de terminologia de Taekwondo ──────────────────────────
// Cada entrada mantém sempre: Hangul + romanização + tradução PT.
// Os dados editáveis estão em techniques.json / poomsae.json — editar via admin mode no app.

import techniquesJson from "./techniques.json";
import poomsaeJson from "./poomsae.json";

export type CategoryId = "seogi" | "jireugi" | "makgi" | "chagi";

export interface Category {
  id: CategoryId;
  label: string;
  korean: string;
  roman: string;
}

export interface Technique {
  id: string;
  hangul: string;
  roman: string;
  pt: string;
  category: CategoryId;
  note?: string;
  image?: string;  // caminho relativo a /images/ (ex: "chagui/ap.jpg")
}

export const CATEGORIES: Category[] = [
  { id: "seogi",    label: "Posições",       korean: "서기",         roman: "Seogi" },
  { id: "jireugi",  label: "Ataques de mão", korean: "지르기 / 치기", roman: "Jireugi / Chigi" },
  { id: "makgi",    label: "Bloqueios",      korean: "막기",         roman: "Makgi" },
  { id: "chagi",    label: "Pontapés",       korean: "차기",         roman: "Chagi" },
];

export let TECHNIQUES: Technique[] = techniquesJson as Technique[];

// Permite ao admin substituir os dados em runtime (após guardar via API)
export function setTechniques(data: Technique[]) { TECHNIQUES = data; }

// ── Poomsae ─────────────────────────────────────────────────────
export interface PoomsaeStep {
  n: number;
  technique: string;   // técnica em coreano (romanizado)
  hangul: string;
  detail: string;      // direção / posição
}

export interface Poomsae {
  id: string;
  group: "Taeguk" | "Palgwe";
  index: number;
  name: string;        // ex: "Taeguk 1 Jang"
  hangul: string;
  trigram: string;     // ☰ etc.
  trigramName: string; // ex: "Keon (Céu)"
  meaning: string;
  moves: number;
  belt?: string;       // id do cinto associado (ex: "branco-amarelo")
  image?: string;      // nome do ficheiro em public/images/poomsae/ (ex: "taeguk-1.jpg")
  steps: PoomsaeStep[];
}

export let POOMSAE: Poomsae[] = poomsaeJson as unknown as Poomsae[];

export function setPoomsae(data: Poomsae[]) { POOMSAE = data; }

// ── Terminologia geral ──────────────────────────────────────────
export interface TermEntry {
  hangul: string;
  roman: string;
  pt: string;
}
export interface TermGroup {
  id: string;
  title: string;
  korean: string;
  entries: TermEntry[];
}

export const TERMINOLOGY: TermGroup[] = [
  {
    id: "greetings",
    title: "Cumprimentos & cortesia",
    korean: "인사",
    entries: [
      { hangul: "안녕하세요", roman: "Annyeonghaseyo", pt: "Olá / Bom dia" },
      { hangul: "감사합니다", roman: "Gamsahamnida", pt: "Obrigado" },
      { hangul: "관장님", roman: "Gwanjangnim", pt: "Mestre (diretor do dojang)" },
      { hangul: "사범님", roman: "Sabeomnim", pt: "Instrutor" },
      { hangul: "도장", roman: "Dojang", pt: "Sala de treino" },
      { hangul: "도복", roman: "Dobok", pt: "Fato de treino" },
    ],
  },
  {
    id: "commands",
    title: "Comandos de treino",
    korean: "구령",
    entries: [
      { hangul: "차렷", roman: "Charyeot", pt: "Sentido / Atenção" },
      { hangul: "경례", roman: "Gyeongnye", pt: "Vénia / Saudação" },
      { hangul: "준비", roman: "Junbi", pt: "Preparar / Posição de pronto" },
      { hangul: "시작", roman: "Sijak", pt: "Começar" },
      { hangul: "그만", roman: "Geuman", pt: "Parar" },
      { hangul: "바로", roman: "Baro", pt: "Voltar à posição / Descansar" },
      { hangul: "뒤로 돌아", roman: "Dwiro Dora", pt: "Meia-volta (mudar de sentido)" },
      { hangul: "기합", roman: "Kihap", pt: "Grito de energia" },
      { hangul: "쉬어", roman: "Swieo", pt: "À vontade" },
    ],
  },
  {
    id: "counting",
    title: "Contagem 1–10",
    korean: "숫자",
    entries: [
      { hangul: "하나", roman: "Hana", pt: "Um (1)" },
      { hangul: "둘", roman: "Dul", pt: "Dois (2)" },
      { hangul: "셋", roman: "Set", pt: "Três (3)" },
      { hangul: "넷", roman: "Net", pt: "Quatro (4)" },
      { hangul: "다섯", roman: "Daseot", pt: "Cinco (5)" },
      { hangul: "여섯", roman: "Yeoseot", pt: "Seis (6)" },
      { hangul: "일곱", roman: "Ilgop", pt: "Sete (7)" },
      { hangul: "여덟", roman: "Yeodeol", pt: "Oito (8)" },
      { hangul: "아홉", roman: "Ahop", pt: "Nove (9)" },
      { hangul: "열", roman: "Yeol", pt: "Dez (10)" },
    ],
  },
  {
    id: "belts",
    title: "Graus & cintos",
    korean: "띠",
    entries: [
      { hangul: "흰 띠", roman: "Huin Ti", pt: "Cinto branco" },
      { hangul: "노란 띠", roman: "Noran Ti", pt: "Cinto amarelo" },
      { hangul: "초록 띠", roman: "Chorok Ti", pt: "Cinto verde" },
      { hangul: "파란 띠", roman: "Paran Ti", pt: "Cinto azul" },
      { hangul: "빨간 띠", roman: "Ppalgan Ti", pt: "Cinto vermelho" },
      { hangul: "검은 띠", roman: "Geomeun Ti", pt: "Cinto preto" },
      { hangul: "급", roman: "Kup", pt: "Grau (antes do preto)" },
      { hangul: "단", roman: "Dan", pt: "Grau de cinto preto" },
    ],
  },
];
