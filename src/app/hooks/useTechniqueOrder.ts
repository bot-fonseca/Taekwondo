import { useState } from "react";
import type { Technique } from "../data/taekwondo";

const KEY = "tkd_technique_order";

function load(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

export function useTechniqueOrder() {
  // version bumps on every reorder to invalidate useMemo dependencies
  const [version, setVersion] = useState(0);

  function getOrdered(category: string, techniques: Technique[]): Technique[] {
    const saved: string[] = load()[category] ?? [];
    if (saved.length === 0) return techniques;
    const pos = new Map<string, number>();
    saved.forEach((id: string, i: number) => pos.set(id, i));
    return [...techniques].sort((a: Technique, b: Technique) => {
      const ai: number = pos.has(a.id) ? (pos.get(a.id) as number) : 999999;
      const bi: number = pos.has(b.id) ? (pos.get(b.id) as number) : 999999;
      return ai - bi;
    });
  }

  function move(category: string, currentList: Technique[], fromIdx: number, delta: number): void {
    const toIdx = fromIdx + delta;
    if (toIdx < 0 || toIdx >= currentList.length) return;
    const ids = currentList.map((t: Technique) => t.id);
    const [moved] = ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, moved);
    localStorage.setItem(KEY, JSON.stringify({ ...load(), [category]: ids }));
    setVersion((v: number) => v + 1);
  }

  return { getOrdered, move, version };
}

