// ── O meu cinto ─────────────────────────────────────────────────────────────
// Guardado no browser (localStorage) — cada telemóvel/browser tem o seu.

import { useSyncExternalStore } from "react";
import { BELTS } from "../data/pratica";

const KEY = "tkd_my_belt";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    const id = localStorage.getItem(KEY);
    return id && BELTS.some(b => b.id === id) ? id : null;
  } catch {
    return null;
  }
}

let current = read();

export function setMyBelt(id: string | null) {
  current = id;
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch { /* sem storage (ex: modo privado) — fica só nesta sessão */ }
  listeners.forEach(l => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Id do cinto escolhido, ou null se ainda não foi escolhido. */
export function useMyBelt() {
  return useSyncExternalStore(subscribe, () => current);
}
