const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type SemanticModel = {
  id: string;
  workspace_id: string;
  connection_id: string;
  name: string;
  description?: string | null;
  status: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type SourceTable = {
  database?: string | null;
  schema?: string | null;
  table_name: string;
  table_type?: string | null;
};

export type SourceColumn = {
  source_column: string;
  display_name: string;
  data_type?: string | null;
  is_primary_key: boolean;
  is_foreign_key: boolean;
};

export type SelectedModelTable = {
  source_database?: string | null;
  source_schema?: string | null;
  source_table: string;
  display_name: string;
  table_role: "fact" | "dimension";
};

export async function getWorkspaceModels(
  workspaceId: string
): Promise<SemanticModel[]> {
  const response = await fetch(`${API_BASE_URL}/api/models/workspace/${workspaceId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to load models.");
  }

  return response.json();
}

export async function createSemanticModel(payload: {
  workspace_id: string;
  connection_id: string;
  name: string;
  description?: string | null;
  created_by?: string | null;
}): Promise<SemanticModel> {
  const response = await fetch(`${API_BASE_URL}/api/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to create model.");
  }

  return response.json();
}

export async function addModelTable(
  modelId: string,
  payload: SelectedModelTable
) {
  const response = await fetch(`${API_BASE_URL}/api/models/${modelId}/tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to add table.");
  }

  return response.json();
}

export async function getConnectionDatabases(
  connectionId: string
): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/models/connections/${connectionId}/databases`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to load databases.");
  }

  return response.json();
}

export async function getConnectionTables(
  connectionId: string,
  database: string
): Promise<SourceTable[]> {
  const url = new URL(`${API_BASE_URL}/api/models/connections/${connectionId}/tables`);
  url.searchParams.set("database", database);

  const response = await fetch(url.toString(), { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to load tables.");
  }

  return response.json();
}
export type SemanticModelTable = {
  id: string;
  model_id: string;
  source_database?: string | null;
  source_schema?: string | null;
  source_table: string;
  display_name: string;
  table_role: "fact" | "dimension";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SemanticModelColumn = {
  id: string;
  model_table_id: string;
  source_column: string;
  display_name: string;
  data_type?: string | null;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  is_hidden: boolean;
  semantic_type?: string | null;
};

export type SemanticRelationship = {
  id: string;
  model_id: string;
  from_table_id: string;
  from_column_id?: string;
  to_table_id: string;
  to_column_id?: string;
  relationship_type: "one_to_many" | "many_to_one" | "one_to_one";
  filter_direction?: "single" | "both";
  is_active: boolean;
  is_auto_detected: boolean;
};

export type SemanticModelLayout = {
  id: string;
  model_id: string;
  model_table_id: string;
  x_position: number;
  y_position: number;
};

export type SemanticModelDetail = {
  model: SemanticModel;
  tables: SemanticModelTable[];
  relationships: SemanticRelationship[];
  layouts: SemanticModelLayout[];
  model_columns: SemanticModelColumn[];
};

export async function getSemanticModelDetail(
  modelId: string
): Promise<SemanticModelDetail> {
  const response = await fetch(`${API_BASE_URL}/api/models/${modelId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to load semantic model.");
  }

  return response.json();
}

export async function updateSemanticModel(
  modelId: string,
  payload: {
    name?: string;
    description?: string | null;
    status?: string;
  }
): Promise<SemanticModel> {
  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to update model."
    );
  }

  return response.json();
}

export async function archiveSemanticModel(
  modelId: string
): Promise<SemanticModel> {
  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to archive model."
    );
  }

  return response.json();
}

export async function getModelDetail(
  modelId: string
): Promise<SemanticModelDetail> {
  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to load model detail."
    );
  }

  return response.json();
}

export async function createRelationship(payload: {
  model_id: string;
  from_table_id: string;
  from_column_id: string;
  to_table_id: string;
  to_column_id: string;
  relationship_type:
    | "one_to_many"
    | "many_to_one"
    | "one_to_one";
  filter_direction?: "single" | "both";
  is_auto_detected?: boolean;
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to create relationship."
    );
  }

  return response.json();
}

export async function updateModelLayout(
  modelId: string,
  payload: {
    model_table_id: string;
    x_position: number;
    y_position: number;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/layout`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to update model layout."
    );
  }

  return response.json();
}

export type AutoDetectedRelationship = {
  from_table_id?: string;
  from_table_name: string;
  from_column: string;
  to_table_id?: string;
  to_table_name: string;
  to_column: string;
  confidence: number;
};

export async function autoDetectRelationships(
  modelId: string
): Promise<AutoDetectedRelationship[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/relationships/auto-detect`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail ?? "Failed to auto-detect relationships."
    );
  }

  return response.json();
}

export async function updateRelationship(
  relationshipId: string,
  payload: {
    from_table_id?: string;
    from_column_id?: string;
    to_table_id?: string;
    to_column_id?: string;
    relationship_type?: "one_to_many" | "many_to_one" | "one_to_one";
    filter_direction?: "single" | "both";
    is_active?: boolean;
  }
) {
  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships/${relationshipId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to update relationship.");
  }

  return response.json();
}

export async function archiveRelationship(relationshipId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships/${relationshipId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to archive relationship.");
  }

  return response.json();
}