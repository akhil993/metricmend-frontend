import {
  fetchJson,
  fetchJsonWithAuth,
} from "@/lib/api/fetch";

export type SemanticDeployment = {
  id: string;
  company_id: string;
  source_workspace_id: string;
  target_workspace_id: string;
  semantic_model_id: string;
  deployment_status: string;
  deployed_by: string;
  deployment_notes: string | null;
  created_at: string;
  deployed_at: string | null;
};

export type SemanticSnapshot = {
  id: string;
  semantic_model_id: string;
  workspace_id: string;
  snapshot_version: number;
  snapshot_data: Record<string, unknown>;
  created_by: string;
  created_at: string;
};

export async function getWorkspaceDeployments(workspaceId: string) {
  return fetchJsonWithAuth<SemanticDeployment[]>(
    `/api/governance/deployments/${workspaceId}`
  );
}

export async function getModelSnapshots(modelId: string) {
  return fetchJsonWithAuth<SemanticSnapshot[]>(
    `/api/governance/snapshots/${modelId}`
  );
}

export async function getSnapshotDetail(snapshotId: string) {
  return fetchJsonWithAuth<SemanticSnapshot>(
    `/api/governance/snapshot/${snapshotId}`
  );
}

export type WorkspaceGovernanceSummary = {
  workspace_id: string;
  company_id: string;
  environment_type: string;
  status: string;
  is_production: boolean;
  certification_required: boolean;
  deployment_source_workspace_id: string | null;
};

export async function getWorkspaceGovernanceSummary(
  workspaceId: string
) {
  return fetchJsonWithAuth<WorkspaceGovernanceSummary>(
    `/api/governance/workspaces/${workspaceId}/summary`
  );
}


export type CreateDeploymentPayload = {
  company_id: string;
  source_workspace_id: string;
  target_workspace_id: string;
  semantic_model_id: string;
  deployed_by: string;
  deployment_notes?: string;
};

export async function createDeployment(
  payload: CreateDeploymentPayload
) {
  return fetchJson<SemanticDeployment>(
    "/api/governance/deployments",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type WorkspacePipelineLink = {
  id: string;
  company_id: string;
  source_workspace_id: string;
  target_workspace_id: string;
  source_environment: string;
  target_environment: string;
  pipeline_status: string;
  created_by: string | null;
  created_at: string;
};

export type WorkspacePipelineSummary = {
  workspace_id: string;
  targets: WorkspacePipelineLink[];
  sources: WorkspacePipelineLink[];
};

export type CreateWorkspacePipelinePayload = {
  company_id: string;
  source_workspace_id: string;
  target_workspace_id: string;
};

export async function createWorkspacePipeline(
  payload: CreateWorkspacePipelinePayload
) {
  return fetchJson<WorkspacePipelineLink>(
    "/api/governance/workspace-pipelines",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getWorkspacePipelineSummary(
  workspaceId: string
) {
  return fetchJsonWithAuth<WorkspacePipelineSummary>(
    `/api/governance/workspaces/${workspaceId}/pipeline`
  );
}

export type WorkspaceOption = {
  id: string;
  name: string;
  environment_type: string;
};

export async function getCompanyWorkspaces(companyId: string) {
  return fetchJsonWithAuth<WorkspaceOption[]>(
    `/api/workspaces/by-company/${companyId}`
  );
}

export type WorkspaceGovernancePermissions = {
  workspace_id: string;
  company_id: string;
  role: string | null;
  environment_type: string;
  can_access_governance: boolean;
  can_manage_pipelines: boolean;
  can_certify_models: boolean;
  can_deploy_to_test: boolean;
  can_deploy_to_production: boolean;
  can_create_deployments: boolean;
};

export async function getWorkspaceGovernancePermissions(
  workspaceId: string
) {
  return fetchJsonWithAuth<WorkspaceGovernancePermissions>(
    `/api/governance/workspaces/${workspaceId}/permissions`
  );
}
