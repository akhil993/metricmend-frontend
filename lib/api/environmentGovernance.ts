import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function promoteEnvironment(
  payload: any,
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    "/api/governance/environments/promote",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
