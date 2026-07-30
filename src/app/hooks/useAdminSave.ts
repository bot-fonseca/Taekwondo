/**
 * useAdminSave — hook central para guardar dados via Vite dev API.
 *
 * Em modo de desenvolvimento (pnpm dev):
 *   - Escreve directamente nos ficheiros JSON (techniques.json, hanbeon.json, hoshin.json)
 *   - HMR do Vite recarrega a app com os novos dados
 *
 * Em produção (dist/):
 *   - A API não existe → retorna erro e informa que é necessário dev mode
 *
 * git commit + push: chamado explicitamente pelo componente AdminCommitButton.
 */

export type DataResource = "techniques" | "hanbeon" | "hoshin" | "sequences";

async function postApi(endpoint: string, body: object): Promise<void> {
  const res = await fetch(`/api/admin/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error ?? `Erro ${res.status}`);
  }
}

export async function saveResource(resource: DataResource, data: unknown[]): Promise<void> {
  await postApi("save", { resource, data });
}

/** Mensagem de erro quando a API não está disponível (produção). */
export const DEV_ONLY_MSG =
  "Esta acção só está disponível em modo de desenvolvimento.\n" +
  "Abre o projecto no VS Code e corre: pnpm dev";
