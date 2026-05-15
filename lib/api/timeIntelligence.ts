const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export type TimeIntelligenceSettings = {
  workspace_id: string;
  model_id: string;

  date_table_id?: string | null;
  date_column_id?: string | null;

  calendar_type:
    | "standard"
    | "fiscal"
    | "retail_445";

  week_ending_day?:
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | null;

  week_end_date_column_id?: string | null;

  fiscal_year_column_id?: string | null;
  fiscal_quarter_column_id?: string | null;
  fiscal_period_column_id?: string | null;
  fiscal_week_column_id?: string | null;

  year_end_month?: number | null;
  year_end_day?: number | null;

  uses_53_week_calendar: boolean;

  week_53_strategy:
    | "include_in_last_period"
    | "separate_week_53"
    | "compare_to_week_52";
};

type SettingsResponse = {
  success: boolean;
  settings: Partial<TimeIntelligenceSettings>;
};

export async function getTimeIntelligenceSettings(
  workspaceId: string,
  modelId: string
): Promise<SettingsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/time-intelligence/settings/${workspaceId}/${modelId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load time intelligence settings."
    );
  }

  return response.json();
}

export async function saveTimeIntelligenceSettings(
  payload: TimeIntelligenceSettings
): Promise<SettingsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/time-intelligence/settings`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save time intelligence settings."
    );
  }

  return response.json();
}

export type GenerateTimeCalcsPayload = {
  workspace_id: string;
  model_id: string;
  metric_ids: string[];
  calculation_types: string[];
};

export type GeneratedTimeCalcItem = {
  metric_id?: string;

  metric_name: string;
  calculation_type: string;

  generated_metric_name: string;
  generated_display_name: string;

  formula: string;
  explanation: string;
};

export type GenerateTimeCalcsResponse = {
  success: boolean;
  generated_metrics: GeneratedTimeCalcItem[];
  warnings: string[];
};

export async function generateTimeCalculations(
  payload: GenerateTimeCalcsPayload
): Promise<GenerateTimeCalcsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/time-intelligence/generate`,
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
      error?.detail ||
        "Failed to generate time intelligence metrics."
    );
  }

  return response.json();
}