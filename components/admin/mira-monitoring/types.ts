export type SummaryResponse = {
  total_queries: number;
  success_count: number;
  failed_count: number;
  avg_execution_ms: number;
  top_metrics?: [string, number][];
  top_dimensions?: [string, number][];
};

export type ActiveTab = "company_chats" | "failures" | "recent_queries";

export type RecentQuery = {
  id: string;
  thread_id?: string | null;
  user_id?: string | null;
  user_email?: string | null;
  question?: string | null;
  status?: string | null;
  row_count?: number | null;
  execution_time_ms?: number | null;
  connector_key?: string | null;
  guardrail_passed?: boolean | null;
  planner_source?: string | null;
  is_follow_up?: boolean | null;
  created_at?: string | null;

  query_type?: string | null;
  metric?: string | null;
  dimension?: string | null;
  guardrail_status?: string | null;
  sql?: string | null;
  error_message?: string | null;
};

export type CompanyChat = {
  thread_id?: string | null;
  title?: string | null;
  user_id?: string | null;
  user_email?: string | null;
  user_name?: string | null;
  workspace_id?: string | null;
  workspace_name?: string | null;
  message_count?: number | null;
  query_count?: number | null;
  success_count?: number | null;
  failed_count?: number | null;
  avg_execution_ms?: number | null;
  last_activity_at?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  created_by_email?: string | null;
  created_by_name?: string | null;
  launchpad_name?: string | null;
};

export type ThreadInspector = {
  thread?: CompanyChat | null;
  messages?: any[];
  audit_logs?: RecentQuery[];
};