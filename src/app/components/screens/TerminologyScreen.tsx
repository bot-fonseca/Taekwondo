import { TERMINOLOGY } from "../../data/taekwondo";
import { BELTS } from "../../data/pratica";
import { BeltStrip } from "../BeltStrip";
import { SectionTitle, HangulPair } from "../atoms";
import { Trigram } from "../Trigram";

const DECOR = ["☱", "☴", "띠", "☵", "☶"];

export function TerminologyScreen() {
  return (
    <div className="px-4 pt-6">
      <SectionTitle decor="☷">Terminologia geral</SectionTitle>

      <div className="flex flex-col gap-6 pb-2">
        {TERMINOLOGY.map((g, gi) => {
          // Cintos: visualização especial com as 10 faixas coloridas
          if (g.id === "belts") {
            return (
              <section key={g.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Trigram glyph={DECOR[gi % DECOR.length]} size={18} color="var(--tkd-muted)" className="opacity-60" />
                  <h3 className="font-display" style={{ fontSize: 15, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-text)" }}>
                    {g.title}
                  </h3>
                  <span className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{g.korean}</span>
                </div>
                <ul className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--tkd-border)" }}>
                  {BELTS.map((belt, i) => (
                    <li
                      key={belt.id}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: "var(--tkd-surface)",
                        borderTop: i === 0 ? "none" : "1px solid var(--tkd-border)",
                      }}
                    >
                      <BeltStrip color={belt.color} stripe={belt.stripe} width={56} height={12} />
                      <div className="flex-1 min-w-0">
                        <HangulPair hangul={belt.korean} roman={belt.roman} size="sm" />
                      </div>
                      <span style={{ fontSize: 14, color: "var(--tkd-text)" }}>{belt.label}</span>
                    </li>
                  ))}
                  {/* Kup e Dan */}
                  {g.entries.filter(e => e.roman === "Kup" || e.roman === "Dan").map((e) => (
                    <li
                      key={e.roman}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ background: "var(--tkd-surface)", borderTop: "1px solid var(--tkd-border)" }}
                    >
                      <div className="w-14 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <HangulPair hangul={e.hangul} roman={e.roman} size="sm" />
                      </div>
                      <span style={{ fontSize: 14, color: "var(--tkd-text)" }}>{e.pt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          // Render padrão para os restantes grupos
          return (
            <section key={g.id}>
              <div className="flex items-center gap-2 mb-2">
                <Trigram glyph={DECOR[gi % DECOR.length]} size={18} color="var(--tkd-muted)" className="opacity-60" />
                <h3 className="font-display" style={{ fontSize: 15, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tkd-text)" }}>
                  {g.title}
                </h3>
                <span className="font-kr" style={{ fontSize: 13, color: "var(--tkd-muted)" }}>{g.korean}</span>
              </div>
              <ul className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--tkd-border)" }}>
                {g.entries.map((e, i) => (
                  <li
                    key={e.roman}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      background: "var(--tkd-surface)",
                      borderTop: i === 0 ? "none" : "1px solid var(--tkd-border)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <HangulPair hangul={e.hangul} roman={e.roman} size="sm" />
                    </div>
                    <span className="text-right" style={{ fontSize: 14, color: "var(--tkd-text)" }}>{e.pt}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
