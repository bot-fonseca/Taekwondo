// ── Dados de terminologia de Taekwondo ──────────────────────────
// Cada entrada mantém sempre: Hangul + romanização + tradução PT.
// Os dados editáveis estão em techniques.json — editar via admin mode no app.

import techniquesJson from "./techniques.json";

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
  steps: PoomsaeStep[];
}

const TRIGRAMS = [
  { g: "☰", name: "Keon", pt: "Céu" },
  { g: "☱", name: "Tae", pt: "Lago" },
  { g: "☲", name: "Ri", pt: "Fogo" },
  { g: "☳", name: "Jin", pt: "Trovão" },
  { g: "☴", name: "Seon", pt: "Vento" },
  { g: "☵", name: "Gam", pt: "Água" },
  { g: "☶", name: "Gan", pt: "Montanha" },
  { g: "☷", name: "Gon", pt: "Terra" },
];

const MEANINGS = [
  "O Céu e a luz — a fonte de toda a criação.",
  "A alegria e a serenidade interior, firmes por dentro.",
  "O Fogo e o calor — entusiasmo e energia.",
  "O Trovão — poder e dignidade, calma perante o perigo.",
  "O Vento — força suave mas penetrante.",
  "A Água — fluidez que ultrapassa qualquer obstáculo.",
  "A Montanha — firmeza, ponderação e estabilidade.",
  "A Terra — o fim de um ciclo e o início de outro.",
];

// Passos ilustrativos — o 1º Poomsae é detalhado; os restantes trazem
// um esqueleto representativo do número de movimentos.
const TAEGUK1_STEPS: PoomsaeStep[] = [
  { n: 1, technique: "Ap Seogi + Arae Makgi", hangul: "앞 서기 / 아래 막기", detail: "Vira à esquerda (90°), bloqueio baixo." },
  { n: 2, technique: "Ap Seogi + Momtong Jireugi", hangul: "앞 서기 / 몸통 지르기", detail: "Avança, soco médio." },
  { n: 3, technique: "Ap Seogi + Arae Makgi", hangul: "앞 서기 / 아래 막기", detail: "Vira à direita (180°), bloqueio baixo." },
  { n: 4, technique: "Ap Seogi + Momtong Jireugi", hangul: "앞 서기 / 몸통 지르기", detail: "Avança, soco médio." },
  { n: 5, technique: "Apkubi + Arae Makgi", hangul: "앞굽이 / 아래 막기", detail: "Vira à esquerda (90°), bloqueio baixo em posição longa." },
  { n: 6, technique: "Ap Seogi + An Makgi", hangul: "앞 서기 / 안 막기", detail: "Vira à direita, bloqueio de fora para dentro." },
  { n: 7, technique: "Ap Seogi + Momtong Jireugi", hangul: "앞 서기 / 몸통 지르기", detail: "Avança, soco médio." },
  { n: 8, technique: "Ap Seogi + An Makgi", hangul: "앞 서기 / 안 막기", detail: "Vira à esquerda, bloqueio de fora para dentro." },
  { n: 9, technique: "Ap Seogi + Momtong Jireugi", hangul: "앞 서기 / 몸통 지르기", detail: "Avança, soco médio." },
  { n: 10, technique: "Apkubi + Arae Makgi", hangul: "앞굽이 / 아래 막기", detail: "Vira à direita (90°), bloqueio baixo longo." },
  { n: 11, technique: "Ap Seogi + Eolgul Makgi + Ap Chagi", hangul: "앞 서기 / 얼굴 막기 / 앞 차기", detail: "Bloqueio alto, pontapé frontal, soco." },
  { n: 12, technique: "Eolgul Makgi + Ap Chagi + Momtong Jireugi", hangul: "얼굴 막기 / 앞 차기 / 몸통 지르기", detail: "Lado oposto, bloqueio alto, pontapé, soco." },
  { n: 13, technique: "Apkubi + Arae Makgi", hangul: "앞굽이 / 아래 막기", detail: "Vira à esquerda, bloqueio baixo longo." },
  { n: 14, technique: "Ap Seogi + Momtong Jireugi", hangul: "앞 서기 / 몸통 지르기", detail: "Avança, soco médio (kihap)." },
  { n: 15, technique: "Ap Seogi + Momtong An Makgi", hangul: "앞 서기 / 몸통 안 막기", detail: "Regressa, bloqueio médio." },
  { n: 16, technique: "Ap Seogi + Momtong An Makgi", hangul: "앞 서기 / 몸통 안 막기", detail: "Lado oposto, bloqueio médio." },
  { n: 17, technique: "Apkubi + Momtong Jireugi", hangul: "앞굽이 / 몸통 지르기", detail: "Avança em posição longa, soco médio, kihap." },
];

function skeletonSteps(count: number): PoomsaeStep[] {
  return Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    technique: "—",
    hangul: "—",
    detail: "Sequência de movimento (consultar instrutor).",
  }));
}

const TAEGUK_MOVES = [17, 18, 20, 20, 20, 19, 21, 24];
const PALGWE_MOVES = [17, 23, 22, 20, 22, 19, 20, 24];

export const POOMSAE: Poomsae[] = [
  ...TAEGUK_MOVES.map((m, i) => ({
    id: `taeguk-${i + 1}`,
    group: "Taeguk" as const,
    index: i + 1,
    name: `Taeguk ${i + 1} Jang`,
    hangul: `태극 ${["일", "이", "삼", "사", "오", "육", "칠", "팔"][i]}장`,
    trigram: TRIGRAMS[i].g,
    trigramName: `${TRIGRAMS[i].name} (${TRIGRAMS[i].pt})`,
    meaning: MEANINGS[i],
    moves: m,
    steps: i === 0 ? TAEGUK1_STEPS : skeletonSteps(m),
  })),
  ...PALGWE_MOVES.map((m, i) => ({
    id: `palgwe-${i + 1}`,
    group: "Palgwe" as const,
    index: i + 1,
    name: `Palgwe ${i + 1} Jang`,
    hangul: `팔괘 ${["일", "이", "삼", "사", "오", "육", "칠", "팔"][i]}장`,
    trigram: TRIGRAMS[i].g,
    trigramName: `${TRIGRAMS[i].name} (${TRIGRAMS[i].pt})`,
    meaning: MEANINGS[i],
    moves: m,
    steps: skeletonSteps(m),
  })),
];

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
      { hangul: "급", roman: "Geup", pt: "Grau (antes do preto)" },
      { hangul: "단", roman: "Dan", pt: "Grau de cinto preto" },
    ],
  },
];
