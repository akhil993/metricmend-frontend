import {
  getApiBaseUrl,
  getErrorMessage,
} from "@/lib/api/fetch";
import {
  getCurrentAccessToken,
  getCurrentUserId,
} from "@/lib/auth/session";

const API_BASE_URL = getApiBaseUrl();

function apiErrorMessage(error: unknown, fallback: string) {
  const message = getErrorMessage(error);

  return message === "Request failed" ? fallback : message;
}

async function getAuthHeaders() {
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  return {
    Authorization: `Bearer ${accessToken}`,
    "user-id": userId,
  };
}

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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/models/workspace/${workspaceId}`, {
    headers: authHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to load models."));
  }

  return response.json();
}

export async function getAccessibleModels(): Promise<SemanticModel[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/models/accessible`, {
    headers: authHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      apiErrorMessage(error, "Failed to load accessible models.")
    );
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to create model."));
  }

  return response.json();
}

export async function addModelTable(
  modelId: string,
  payload: SelectedModelTable
) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/models/${modelId}/tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to add table."));
  }

  return response.json();
}

export async function getConnectionDatabases(
  connectionId: string
): Promise<string[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/connections/${connectionId}/databases`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to load databases."));
  }

  return response.json();
}

export async function getConnectionTables(
  connectionId: string,
  database: string
): Promise<SourceTable[]> {
  const authHeaders = await getAuthHeaders();

  const url = new URL(`${API_BASE_URL}/api/models/connections/${connectionId}/tables`);
  url.searchParams.set("database", database);

  const response = await fetch(url.toString(), {
    headers: authHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to load tables."));
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

export type SemanticModelSecuritySettings = {
  model_id: string;
  configured: boolean;
  rls_enabled: boolean;
  ols_enabled: boolean;
  mira_access_enabled: boolean;
  metric_creation_enabled: boolean;
  row_access_mode: string;
  object_access_mode: string;
  updated_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SemanticModelSecurityRole = {
  id: string;
  model_id: string;
  name: string;
  description?: string | null;
  principal_type: string;
  principal_value: string;
  is_active: boolean;
};

export type SemanticModelRowSecurityRule = {
  id: string;
  model_id: string;
  role_id?: string | null;
  table_id: string;
  rule_name: string;
  filter_expression: string;
  is_active: boolean;
};

export type SemanticModelObjectSecurityRule = {
  id: string;
  model_id: string;
  role_id?: string | null;
  object_type: string;
  object_id: string;
  access_level: string;
  is_active: boolean;
};

export type SemanticModelSecurityBundle = {
  settings: SemanticModelSecuritySettings;
  roles: SemanticModelSecurityRole[];
  row_rules: SemanticModelRowSecurityRule[];
  object_rules: SemanticModelObjectSecurityRule[];
};

export type ModelSecurityPrincipal = {
  user_id: string;
  role?: string | null;
  email?: string | null;
  full_name?: string | null;
  label: string;
};

export async function getSemanticModelDetail(
  modelId: string
): Promise<SemanticModelDetail> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/models/${modelId}`, {
    headers: authHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      apiErrorMessage(error, "Failed to load semantic model.")
    );
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to update model.")
    );
  }

  return response.json();
}

export async function archiveSemanticModel(
  modelId: string
): Promise<SemanticModel> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      method: "DELETE",
      headers: authHeaders,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to archive model.")
    );
  }

  return response.json();
}

export async function getModelDetail(
  modelId: string
): Promise<SemanticModelDetail> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to load model detail.")
    );
  }

  return response.json();
}

export async function getModelSecuritySettings(
  modelId: string
): Promise<SemanticModelSecuritySettings> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(
        error,
        "Failed to load model security settings."
      )
    );
  }

  return response.json();
}

export async function getModelSecurityBundle(
  modelId: string
): Promise<SemanticModelSecurityBundle> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security/bundle`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to load model security rules.")
    );
  }

  return response.json();
}

export async function getModelSecurityPrincipals(
  modelId: string
): Promise<ModelSecurityPrincipal[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security/principals`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to load model users.")
    );
  }

  const data = await response.json();

  return data.items || [];
}

export async function updateModelSecuritySettings(
  modelId: string,
  payload: Omit<
    SemanticModelSecuritySettings,
    | "model_id"
    | "configured"
    | "updated_by"
    | "created_at"
    | "updated_at"
  >
): Promise<SemanticModelSecuritySettings> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(
        error,
        "Failed to save model security settings."
      )
    );
  }

  return response.json();
}

export async function createModelSecurityRole(
  modelId: string,
  payload: {
    name: string;
    description?: string | null;
    principal_type: string;
    principal_value: string;
  }
): Promise<SemanticModelSecurityRole> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security/roles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to add security role."));
  }

  return response.json();
}

export async function createModelRowSecurityRule(
  modelId: string,
  payload: {
    role_id?: string | null;
    table_id: string;
    rule_name: string;
    filter_expression: string;
  }
): Promise<SemanticModelRowSecurityRule> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security/row-rules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to add row rule."));
  }

  return response.json();
}

export async function createModelObjectSecurityRule(
  modelId: string,
  payload: {
    role_id?: string | null;
    object_type: string;
    object_id: string;
    access_level: string;
  }
): Promise<SemanticModelObjectSecurityRule> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/security/object-rules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to add object rule."));
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to create relationship.")
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/layout`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to update model layout.")
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/${modelId}/relationships/auto-detect`,
    {
      method: "POST",
      headers: authHeaders,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      apiErrorMessage(error, "Failed to auto-detect relationships.")
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships/${relationshipId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      apiErrorMessage(error, "Failed to update relationship.")
    );
  }

  return response.json();
}

export async function archiveRelationship(relationshipId: string) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/models/relationships/${relationshipId}`,
    {
      method: "DELETE",
      headers: authHeaders,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      apiErrorMessage(error, "Failed to archive relationship.")
    );
  }

  return response.json();
}
