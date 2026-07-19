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

export type MetricType =
  | "base"
  | "calculated"
  | "time_intelligence"
  | "mira_generated";

export type UserCreatableMetricType = "base" | "calculated";

export type MetricStatus = "draft" | "approved" | "deprecated";

export type SemanticMetric = {
  id: string;
  workspace_id: string;
  model_id: string;
  name: string;
  display_name: string;
  description?: string | null;
  metric_type: MetricType;
  aggregation_type?: string | null;
  source_table_id?: string | null;
  source_column_id?: string | null;
  expression?: string | null;
  expression_json?: Record<string, unknown> | null;
  filter_json?: Record<string, unknown> | null;
  format_type?: string | null;
  status: MetricStatus;
  is_active?: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;

  user_formula?: string | null;
  compiled_expression?: string | null;
  version?: number | null;
  validation_status?: string | null;
  validation_errors?: unknown;
  last_validated_at?: string | null;
  updated_by?: string | null;
};

export type MetricValidationError = {
  code: string;
  message: string;
  path?: string | null;
};

export type MetricDependencyItem = {
  metric_id?: string | null;
  metric_name?: string | null;
  table_id?: string | null;
  table?: string | null;
  column_id?: string | null;
  column?: string | null;
  data_type?: string | null;
};

export type MetricValidateResponse = {
  valid: boolean;
  expression_json?: Record<string, unknown> | null;
  compiled_expression?: string | null;
  dependencies: {
    metrics: MetricDependencyItem[];
    columns: MetricDependencyItem[];
    tables: MetricDependencyItem[];
  };
  errors: MetricValidationError[];
};

export type ValidateMetricFormulaPayload = {
  workspace_id: string;
  model_id: string;
  formula: string;
  metric_type?: UserCreatableMetricType;
  current_metric_id?: string | null;
};

export type CreateMetricPayload = {
  workspace_id: string;
  model_id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  metric_type: UserCreatableMetricType;
  aggregation_type?: string | null;
  source_table_id?: string | null;
  source_column_id?: string | null;
  expression: string;
  expression_json: Record<string, unknown>;
  format_type: string;
};

export type UpdateMetricPayload = Partial<CreateMetricPayload>;

export type SemanticMetricVersion = {
  id: string;
  metric_id: string;
  version: number;
  name: string;
  display_name?: string | null;
  description?: string | null;
  metric_type: MetricType;
  aggregation_type?: string | null;
  expression: string;
  expression_json?: Record<string, unknown> | null;
  format_type?: string | null;
  snapshot_json?: Record<string, unknown> | null;
  created_by?: string | null;
  created_at?: string | null;
};

export async function getModelMetrics(
  modelId: string
): Promise<SemanticMetric[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics/model/${modelId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load model metrics.");
  }

  return response.json();
}

export async function validateMetricFormula(
  payload: ValidateMetricFormulaPayload
): Promise<MetricValidateResponse> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to validate metric formula."));
  }

  return response.json();
}

export async function createMetric(
  payload: CreateMetricPayload
): Promise<SemanticMetric> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to create metric."));
  }

  return response.json();
}

export async function archiveMetric(metricId: string): Promise<void> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics/${metricId}`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to archive metric.");
  }
}

export async function updateMetric(
  metricId: string,
  payload: UpdateMetricPayload
): Promise<SemanticMetric> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics/${metricId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(apiErrorMessage(error, "Failed to update metric."));
  }

  return response.json();
}
export async function getMetricVersions(
  metricId: string
): Promise<SemanticMetricVersion[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/metrics/${metricId}/versions`, {
    headers: authHeaders,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to load metric versions");
  }

  return response.json();
}
export type InterpretMetricPayload = {
  workspace_id: string;
  model_id: string;
  intent: string;
};

export type InterpretMetricResponse = {
  success: boolean;
  formula: string;
  explanation: string;
  dependencies: string[];
  warnings: string[];
};

export async function interpretMetric(
  payload: InterpretMetricPayload
): Promise<InterpretMetricResponse> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/metrics/interpret`,
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
    throw new Error("Failed to interpret metric");
  }

  return response.json();
}
