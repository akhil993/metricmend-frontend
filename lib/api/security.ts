import { fetchJsonWithAuth } from "@/lib/api/fetch";

export type SecurityControlStatus = "active" | "needs_attention";

export type SecurityControl = {
  key: string;
  label: string;
  description: string;
  status: SecurityControlStatus;
};

export type ModelSecurityTable = {
  table_name: string;
  exists: boolean;
  rls_enabled: boolean;
  rls_forced: boolean;
  policies: string[];
};

export type ModelSecurityStatus = {
  status: "ready" | "needs_attention";
  model_security: {
    rls_enabled: boolean;
    ols_enabled: boolean;
    tables: ModelSecurityTable[];
  };
  controls: SecurityControl[];
  issues: string[];
};

export function getModelSecurityStatus() {
  return fetchJsonWithAuth<ModelSecurityStatus>(
    "/api/security/models"
  );
}
