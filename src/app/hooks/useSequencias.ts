import { SEQUENCIAS, setSequencias } from "../data/pratica";
import type { Sequencia, SequenciaStep } from "../data/pratica";
import { saveResource } from "./useAdminSave";

export function useSequencias() {
  // SEQUENCIAS is a live ESM binding — always reflects the current module state
  return {
    sequencias: SEQUENCIAS,

    async criar(nome: string, descricao: string, passos: SequenciaStep[], belt?: string): Promise<Sequencia> {
      const nova: Sequencia = {
        id: crypto.randomUUID(),
        nome,
        descricao: descricao || undefined,
        belt: belt || undefined,
        passos,
        criadaEm: Date.now(),
      };
      const updated = [nova, ...SEQUENCIAS];
      await saveResource("sequences", updated);
      setSequencias(updated);
      return nova;
    },

    async editar(id: string, nome: string, descricao: string, passos: SequenciaStep[], belt?: string): Promise<void> {
      const updated = SEQUENCIAS.map(s =>
        s.id === id ? { ...s, nome, descricao: descricao || undefined, belt: belt || undefined, passos } : s
      );
      await saveResource("sequences", updated);
      setSequencias(updated);
    },

    async eliminar(id: string): Promise<void> {
      const updated = SEQUENCIAS.filter(s => s.id !== id);
      await saveResource("sequences", updated);
      setSequencias(updated);
    },
  };
}

