// ── Notificação de alterações aos dados ─────────────────────────────────────
// Os dados vivem em variáveis de módulo (TECHNIQUES, POOMSAE, HANBEON, ...).
// Os setters chamam notifyDataChanged() para que a App volte a renderizar,
// sem depender do HMR do Vite.

import { useSyncExternalStore } from "react";

let version = 0;
const listeners = new Set<() => void>();

export function notifyDataChanged() {
  version++;
  listeners.forEach(l => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useDataVersion() {
  return useSyncExternalStore(subscribe, () => version);
}
