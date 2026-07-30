import { ReactNode } from "react";
import { Trigram } from "./Trigram";

// Título de secção — tipo display, usado com moderação, com um trigrama
// decorativo discreto como separador.
export function SectionTitle({ children, decor }: { children: ReactNode; decor?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2
        className="font-display"
        style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--tkd-text)" }}
      >
        {children}
      </h2>
      {decor && <Trigram glyph={decor} size={26} color="var(--tkd-muted)" className="opacity-60" />}
    </div>
  );
}

// Par Hangul + romanização — o Hangul nunca aparece sozinho.
export function HangulPair({
  hangul,
  roman,
  size = "md",
}: {
  hangul: string;
  roman: string;
  size?: "sm" | "md" | "lg";
}) {
  const hangulSize = size === "lg" ? 34 : size === "md" ? 20 : 17;
  const romanSize = size === "lg" ? 18 : size === "md" ? 15 : 14;
  return (
    <div className="flex flex-col">
      <span className="font-kr" style={{ fontSize: hangulSize, lineHeight: 1.25, color: "var(--tkd-text)" }}>
        {hangul}
      </span>
      <span style={{ fontSize: romanSize, color: "var(--tkd-blue)", fontWeight: 600 }}>{roman}</span>
    </div>
  );
}

// Etiqueta de categoria
export function CategoryTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5"
      style={{
        fontSize: 12,
        color: "var(--tkd-text)",
        background: "var(--tkd-red-soft)",
        border: "1px solid rgba(178,58,52,0.35)",
      }}
    >
      {label}
    </span>
  );
}

// Cartão base
export function Card({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`text-left w-full rounded-xl transition-colors ${className}`}
      style={{
        background: "var(--tkd-surface)",
        border: "1px solid var(--tkd-border)",
      }}
    >
      {children}
    </Comp>
  );
}
