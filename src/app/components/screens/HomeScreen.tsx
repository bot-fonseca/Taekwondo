import { useMemo, useState } from "react";
import { Search, Hand, Grid3x3, BookOpen, ChevronRight, Dumbbell } from "lucide-react";
import { TECHNIQUES, POOMSAE, TERMINOLOGY, CATEGORIES } from "../../data/taekwondo";
import { HangulPair } from "../atoms";
import { Trigram } from "../Trigram";
import type { TabId } from "../BottomNav";

interface Props {
  onOpenTechnique: (id: string) => void;
  onOpenPoomsae: (id: string) => void;
  onGoTab: (t: TabId) => void;
}

type Result =
  | { kind: "technique"; id: string; hangul: string; roman: string; pt: string; sub: string }
  | { kind: "poomsae"; id: string; hangul: string; roman: string; pt: string; trigram: string }
  | { kind: "term"; id: string; hangul: string; roman: string; pt: string; sub: string };

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function HomeScreen({ onOpenTechnique, onOpenPoomsae, onGoTab }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo<Result[]>(() => {
    const q = norm(query.trim());
    if (!q) return [];
    const out: Result[] = [];
    const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? "";

    for (const t of TECHNIQUES) {
      if (norm(t.roman).includes(q) || norm(t.pt).includes(q) || t.hangul.includes(query.trim())) {
        out.push({ kind: "technique", id: t.id, hangul: t.hangul, roman: t.roman, pt: t.pt, sub: catLabel(t.category) });
      }
    }
    for (const p of POOMSAE) {
      if (norm(p.name).includes(q) || norm(p.meaning).includes(q) || p.hangul.includes(query.trim())) {
        out.push({ kind: "poomsae", id: p.id, hangul: p.hangul, roman: p.name, pt: p.trigramName, trigram: p.trigram });
      }
    }
    for (const g of TERMINOLOGY) {
      for (const e of g.entries) {
        if (norm(e.roman).includes(q) || norm(e.pt).includes(q) || e.hangul.includes(query.trim())) {
          out.push({ kind: "term", id: `${g.id}-${e.roman}`, hangul: e.hangul, roman: e.roman, pt: e.pt, sub: g.title });
        }
      }
    }
    return out;
  }, [query]);

  const quick = [
    { id: "pratica"  as TabId, label: "Prática",            korean: "연습", Icon: Dumbbell,  decor: "(하태)" },
    { id: "tecnicas" as TabId, label: "Técnicas soltas",   korean: "기술", Icon: Hand,      decor: "☲" },
    { id: "poomsae"  as TabId, label: "Poomsae",           korean: "품새", Icon: Grid3x3,   decor: "☰" },
    { id: "termos"   as TabId, label: "Terminologia geral", korean: "용어", Icon: BookOpen,  decor: "☷" },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-1">
        <Trigram glyph="☰" size={22} color="var(--tkd-red)" />
        <span className="font-kr" style={{ fontSize: 15, color: "var(--tkd-muted)" }}>태권도 용어</span>
      </div>
      <h1 className="font-display" style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1.1 }}>
        Terminologia<br />de Taekwondo
      </h1>

      {/* Barra de pesquisa em destaque */}
      <div className="mt-5 sticky top-2 z-10">
        <label className="relative block">
          <span className="sr-only">Pesquisar técnica ou termo</span>
          <Search size={20} color="var(--tkd-muted)" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar em coreano ou português…"
            className="w-full rounded-xl pl-12 pr-4 outline-none"
            style={{
              height: 54,
              background: "var(--tkd-surface)",
              border: "1px solid var(--tkd-border)",
              color: "var(--tkd-text)",
              fontSize: 16,
            }}
          />
        </label>
      </div>

      {query.trim() ? (
        <div className="mt-4 pb-4">
          <p style={{ fontSize: 13, color: "var(--tkd-muted)" }} className="mb-2">
            {results.length} resultado{results.length !== 1 ? "s" : ""}
          </p>
          <ul className="flex flex-col gap-2">
            {results.map((r) => (
              <li key={`${r.kind}-${r.id}`}>
                <button
                  type="button"
                  onClick={() => (r.kind === "poomsae" ? onOpenPoomsae(r.id) : r.kind === "technique" ? onOpenTechnique(r.id) : undefined)}
                  className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
                >
                  {r.kind === "poomsae" ? (
                    <Trigram glyph={r.trigram} size={30} color="var(--tkd-text)" />
                  ) : (
                    <span
                      className="shrink-0 rounded-md"
                      style={{ width: 6, height: 34, background: r.kind === "technique" ? "var(--tkd-red)" : "var(--tkd-blue)" }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <HangulPair hangul={r.hangul} roman={r.roman} size="sm" />
                    <span style={{ fontSize: 14, color: "var(--tkd-text)" }}>{r.pt}</span>
                  </div>
                  {r.kind !== "term" && <ChevronRight size={18} color="var(--tkd-muted)" />}
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="text-center py-10" style={{ color: "var(--tkd-muted)" }}>
                Sem resultados para “{query}”.
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="mt-6">
          <p style={{ fontSize: 13, color: "var(--tkd-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }} className="font-display mb-3">
            Acesso rápido
          </p>
          <div className="flex flex-col gap-3">
            {quick.map(({ id, label, korean, Icon, decor }) => (
              <button
                key={id}
                type="button"
                onClick={() => onGoTab(id)}
                className="w-full rounded-xl px-4 py-4 flex items-center gap-4"
                style={{ background: "var(--tkd-surface)", border: "1px solid var(--tkd-border)" }}
              >
                <span
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 46, height: 46, background: "var(--tkd-blue-soft)", border: "1px solid rgba(43,90,130,0.4)" }}
                >
                  <Icon size={22} color="var(--tkd-text)" />
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-display" style={{ fontSize: 17, letterSpacing: "0.02em" }}>{label}</span>
                  <span className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{korean}</span>
                </span>
                <Trigram glyph={decor} size={24} color="var(--tkd-muted)" className="opacity-50" />
                <ChevronRight size={20} color="var(--tkd-muted)" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
