
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function promoteEnvironment(
  payload: any,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/environments/promote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to promote environment asset"
    );
  }

  return response.json();
}