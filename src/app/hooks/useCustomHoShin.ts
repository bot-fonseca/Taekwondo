import { useState, useCallback } from "react";
import type { HoShinSul, HoShinSulStep } from "../data/pratica";

const KEY = "tkd_custom_hoshin";

function load(): HoShinSul[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(d: HoShinSul[]) { localStorage.setItem(KEY, JSON.stringify(d)); }

export function useCustomHoShin() {
  const [custom, setCustom] = useState<HoShinSul[]>(load);

  const persist = useCallback((u: HoShinSul[]) => { save(u); setCustom(u); }, []);

  const criar = useCallback((situacao: string, passos: HoShinSulStep[]): HoShinSul => {
    const novo: HoShinSul = { id: `hs-c-${crypto.randomUUID()}`, situacao, passos };
    persist([...load(), novo]);
    return novo;
  }, [persist]);

  const editar = useCallback((id: string, situacao: string, passos: HoShinSulStep[]) => {
    persist(load().map(h => h.id === id ? { ...h, situacao, passos } : h));
  }, [persist]);

  const eliminar = useCallback((id: string) => {
    persist(load().filter(h => h.id !== id));
  }, [persist]);

  return { custom, criar, editar, eliminar };
}
