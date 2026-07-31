import { Home, Hand, Grid3x3, BookOpen, Dumbbell, Lock, LockOpen, Sun, Moon } from "lucide-react";
import type { TabId } from "./BottomNav";
import { useAdmin } from "../context/AdminContext";
import { useTheme } from "../context/ThemeContext";

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: "home",     label: "Início",   Icon: Home },
  { id: "pratica",  label: "Prática",  Icon: Dumbbell },
  { id: "tecnicas", label: "Técnicas", Icon: Hand },
  { id: "poomsae",  label: "Poomsae",  Icon: Grid3x3 },
  { id: "termos",   label: "Termos",   Icon: BookOpen },
];

export function SideNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  const { isAdmin, unlock, lock, changePin } = useAdmin();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <nav
      aria-label="Navegação principal"
      className="hidden md:flex flex-col gap-1 p-4 w-52 shrink-0 sticky top-0 h-screen"
      style={{
        background: "var(--tkd-surface)",
        borderRight: "1px solid var(--tkd-border)",
      }}
    >
      <div className="mb-6 px-3 pt-4">
        <p className="font-display font-bold" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tkd-red)" }}>
          태권도
        </p>
        <p className="font-display" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tkd-muted)" }}>
          Taekwondo Ref.
        </p>
      </div>

      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? "page" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left w-full"
            style={{
              background: isActive ? "var(--tkd-red)" : "transparent",
              color: isActive ? "#fff" : "var(--tkd-muted)",
            }}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span className="font-display" style={{ fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {label}
            </span>
          </button>
        );
      })}

      {/* Admin toggle — bottom of sidebar */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t" style={{ borderColor: "var(--tkd-border)" }}>
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors w-full"
          style={{ color: "var(--tkd-muted)" }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {theme === "dark" ? "Modo claro" : "Modo escuro"}
          </span>
        </button>
        <button
          type="button"
          onClick={isAdmin ? lock : unlock}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors w-full"
          style={{ color: isAdmin ? "var(--tkd-red)" : "var(--tkd-muted)" }}
        >
          {isAdmin ? <LockOpen size={16} /> : <Lock size={16} />}
          <span className="font-display" style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {isAdmin ? "Admin (activo)" : "Admin"}
          </span>
        </button>
        {isAdmin && (
          <button type="button" onClick={changePin}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors w-full"
            style={{ color: "var(--tkd-muted)" }}>
            <span className="font-display" style={{ fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Alterar PIN
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
