const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type ConnectorField = {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "number" | "boolean" | "textarea";
  required: boolean;
  placeholder?: string | null;
  help_text?: string | null;
  options?: { label: string; value: string }[] | null;
};

export type ConnectorRegistryItem = {
  key: string;
  name: string;
  category: string;
  status: string;
  icon?: string | null;
  description?: string | null;
  auth_type: string;
  auth_schema: {
    fields: ConnectorField[];
  };
  config_schema: {
    fields: ConnectorField[];
  };
  capabilities: Record<string, boolean>;
};

export type SavedConnection = {
  id: string;
  workspace_id: string;
  workspace_name?: string;
  connector_key: string;
  name: string;
  config: Record<string, unknown>;
  status: string;
  last_tested_at?: string | null;
  last_success_at?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
};

export async function getConnectorRegistry(): Promise<ConnectorRegistryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/connectors/registry`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load connector registry.");
  }

  return response.json();
}

export async function testConnection(payload: {
  connector_key: string;
  credentials: Record<string, unknown>;
  config: Record<string, unknown>;
}) {
  const response = await fetch(`${API_BASE_URL}/api/connections/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Connection test failed.");
  }

  return response.json();
}

export async function saveConnection(payload: {
  workspace_id: string;
  connector_key: string;
  name: string;
  credentials: Record<string, unknown>;
  config: Record<string, unknown>;
  created_by?: string | null;
}): Promise<SavedConnection> {
  const response = await fetch(`${API_BASE_URL}/api/connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to save connection.");
  }

  return response.json();
}

export async function getWorkspaceConnections(
  workspaceId: string
): Promise<SavedConnection[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/connections/workspace/${workspaceId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail ??
        `Failed to load saved connections. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function updateConnection(
  connectionId: string,
  payload: {
    name?: string;
    credentials?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
  }
): Promise<SavedConnection> {
  const response = await fetch(`${API_BASE_URL}/api/connections/${connectionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to update connection.");
  }

  return response.json();
}