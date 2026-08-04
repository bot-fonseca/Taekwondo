import { createContext, useContext, useState, type ReactNode } from "react";

const PIN_KEY     = "tkd_admin_pin";
const SESSION_KEY = "tkd_is_admin";
const DEFAULT_PIN = "4321";

interface AdminCtx {
  isAdmin: boolean;
  unlock: () => void;
  lock: () => void;
  changePin: () => void;
}

const AdminContext = createContext<AdminCtx>({
  isAdmin: false,
  unlock: () => {},
  lock: () => {},
  changePin: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );

  const unlock = () => {
    const stored = localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
    const input = window.prompt("PIN de administrador:");
    if (input === null) return;            // cancelled
    if (input === stored) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAdmin(true);
    } else {
      window.alert("PIN incorrecto.");
    }
  };

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  };

  const changePin = () => {
    const current = localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
    const input = window.prompt("PIN actual:");
    if (input !== current) { window.alert("PIN incorrecto."); return; }
    const novo = window.prompt("Novo PIN:");
    if (!novo || novo.trim().length < 4) { window.alert("PIN tem de ter pelo menos 4 caracteres."); return; }
    localStorage.setItem(PIN_KEY, novo.trim());
    window.alert("PIN alterado com sucesso.");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, unlock, lock, changePin }}>
      {children}
    </AdminContext.Provider>
  );
}
