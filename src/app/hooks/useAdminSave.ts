/**
 * useAdminSave — hook central para guardar dados via Vite dev API.
 *
 * Em modo de desenvolvimento (pnpm dev):
 *   - Escreve directamente nos ficheiros JSON (techniques.json, hanbeon.json, hoshin.json, ...)
 *   - HMR do Vite recarrega a app com os novos dados
 *
 * Em produção (dist/):
 *   - A API não existe → lança um erro com DEV_ONLY_MSG
 */

export type DataResource = "techniques" | "hanbeon" | "hoshin" | "sequences" | "poomsae";

/** Mensagem de erro quando a API não está disponível (produção). */
export const DEV_ONLY_MSG =
  "Esta acção só está disponível em modo de desenvolvimento.\n" +
  "Abre o projecto no VS Code e corre: pnpm dev";

async function postApi(endpoint: string, body: object): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`/api/admin/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Erro de rede — servidor de dev não está a correr
    throw new Error(DEV_ONLY_MSG);
  }
  const json = await res.json().catch(() => null);
  // Sem resposta JSON da API (ex: 404/405 ou index.html de um alojamento estático) → não estamos em dev
  if (!json) throw new Error(DEV_ONLY_MSG);
  if (!res.ok || json.ok !== true) throw new Error(json.error ?? `Erro ${res.status}`);
}

export async function saveResource(resource: DataResource, data: unknown[]): Promise<void> {
  await postApi("save", { resource, data });
}
