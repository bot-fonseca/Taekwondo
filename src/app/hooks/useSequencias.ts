import { SEQUENCIAS, setSequencias } from "../data/pratica";
import type { Sequencia, SequenciaStep } from "../data/pratica";
import { saveResource, DEV_ONLY_MSG } from "./useAdminSave";

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
      try {
        await saveResource("sequences", updated);
        setSequencias(updated);
      } catch (err: any) {
        throw new Error(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
      }
      return nova;
    },

    async editar(id: string, nome: string, descricao: string, passos: SequenciaStep[], belt?: string): Promise<void> {
      const updated = SEQUENCIAS.map(s =>
        s.id === id ? { ...s, nome, descricao: descricao || undefined, belt: belt || undefined, passos } : s
      );
      try {
        await saveResource("sequences", updated);
        setSequencias(updated);
      } catch (err: any) {
        throw new Error(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
      }
    },

    async eliminar(id: string): Promise<void> {
      const updated = SEQUENCIAS.filter(s => s.id !== id);
      try {
        await saveResource("sequences", updated);
        setSequencias(updated);
      } catch (err: any) {
        throw new Error(err.message?.includes("fetch") ? DEV_ONLY_MSG : (err.message ?? String(err)));
      }
    },
  };
}

