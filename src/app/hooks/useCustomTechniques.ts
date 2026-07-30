import { useState, useCallback } from "react";
import type { CategoryId } from "../data/taekwondo";

export interface CustomTechnique {
  id: string;
  hangul: string;
  roman: string;
  pt: string;
  category: CategoryId;
  note?: string;
  criadaEm: number;
}

const KEY = "tkd_custom_techniques";

function load(): CustomTechnique[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(data: CustomTechnique[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useCustomTechniques() {
  const [custom, setCustom] = useState<CustomTechnique[]>(load);

  const persist = useCallback((updated: CustomTechnique[]) => {
    save(updated);
    setCustom(updated);
  }, []);

  const criar = useCallback((fields: Omit<CustomTechnique, "id" | "criadaEm">): CustomTechnique => {
    const nova: CustomTechnique = { ...fields, id: `custom-${crypto.randomUUID()}`, criadaEm: Date.now() };
    persist([nova, ...load()]);
    return nova;
  }, [persist]);

  const editar = useCallback((id: string, fields: Omit<CustomTechnique, "id" | "criadaEm">) => {
    persist(load().map(t => t.id === id ? { ...t, ...fields } : t));
  }, [persist]);

  const eliminar = useCallback((id: string) => {
    persist(load().filter(t => t.id !== id));
  }, [persist]);

  return { custom, criar, editar, eliminar };
}
