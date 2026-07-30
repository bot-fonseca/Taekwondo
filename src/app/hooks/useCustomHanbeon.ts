import { useState, useCallback } from "react";
import type { HanbeonKyorugi, HanbeonStep } from "../data/pratica";

const KEY = "tkd_custom_hanbeon";

function load(): HanbeonKyorugi[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(d: HanbeonKyorugi[]) { localStorage.setItem(KEY, JSON.stringify(d)); }

export function useCustomHanbeon() {
  const [custom, setCustom] = useState<HanbeonKyorugi[]>(load);

  const persist = useCallback((u: HanbeonKyorugi[]) => { save(u); setCustom(u); }, []);

  const criar = useCallback((ataque: string, passos: HanbeonStep[]): HanbeonKyorugi => {
    const all = load();
    const maxN = all.reduce((m, h) => Math.max(m, h.numero), 0);
    const novo: HanbeonKyorugi = { id: `hb-c-${crypto.randomUUID()}`, numero: maxN + 1, ataque, passos };
    persist([...all, novo]);
    return novo;
  }, [persist]);

  const editar = useCallback((id: string, ataque: string, passos: HanbeonStep[]) => {
    persist(load().map(h => h.id === id ? { ...h, ataque, passos } : h));
  }, [persist]);

  const eliminar = useCallback((id: string) => {
    persist(load().filter(h => h.id !== id));
  }, [persist]);

  return { custom, criar, editar, eliminar };
}
