import { Home, Hand, Grid3x3, BookOpen, Dumbbell } from "lucide-react";

export type TabId = "home" | "tecnicas" | "poomsae" | "termos" | "pratica";

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "home",     label: "Início",   Icon: Home },
  { id: "pratica",  label: "Prática",  Icon: Dumbbell },
  { id: "tecnicas", label: "Técnicas", Icon: Hand },
  { id: "poomsae",  label: "Poomsae",  Icon: Grid3x3 },
  { id: "termos",   label: "Termos",   Icon: BookOpen },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 w-full z-40"
      style={{
      background: "var(--tkd-nav-bg)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--tkd-border)",
      }}
    >
      <ul className="flex items-stretch justify-around px-2 pt-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? "page" : undefined}
                className="w-full flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors"
                style={{ color: isActive ? "var(--tkd-text)" : "var(--tkd-muted)" }}
              >
                <span
                  className="flex items-center justify-center rounded-lg transition-all"
                  style={{
                    width: 44,
                    height: 30,
                    background: isActive ? "var(--tkd-red)" : "transparent",
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} color={isActive ? "#fff" : "var(--tkd-muted)"} />
                </span>
                <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
