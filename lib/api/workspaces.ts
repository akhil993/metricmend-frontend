import { createClient } from "@/lib/supabase/client";

export type WorkspaceEnvironment =
  | "development"
  | "test"
  | "production";

export type CreateCompanyWorkspaceInput = {
  companyName: string;
  workspaceName?: string;
};

export type MyWorkspace = {
  workspace_id: string;
  workspace_name: string;
  company_id: string;
  company_name: string;
  environment: WorkspaceEnvironment;
  role: "owner" | "admin" | "editor" | "member" | "viewer";
  workspace_type?: "launchpad" | "shared";
};

export type WorkspaceManagementSummary = {
  company_id: string;
  plan: "free_trial" | "team" | "business" | "enterprise";
  workspace_count: number;
  limits: {
  max_workspaces: number | null;
  max_models: number | null;
};
  workspaces: {
  workspace_id: string;
  workspace_name: string;
  workspace_type?: "launchpad" | "shared";
  environment: WorkspaceEnvironment;
  status: "active" | "suspended" | "deleted";
  role: "owner" | "admin" | "editor" | "member" | "viewer";
  created_at: string;
}[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCompanyWorkspace(
  input: CreateCompanyWorkspaceInput
) {
  const supabase = createClient();

  const companySlug = slugify(input.companyName);

  const { data, error } = await supabase.rpc("create_company_workspace", {
    company_name: input.companyName,
    company_slug: companySlug,
    workspace_name: input.workspaceName ?? "Launchpad",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMyWorkspaces(): Promise<MyWorkspace[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_my_workspaces");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getWorkspaceManagementSummary() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_workspace_management_summary"
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as WorkspaceManagementSummary;
}

export async function createWorkspaceForMyCompany(
  workspaceName: string,
  environment: WorkspaceEnvironment
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "create_workspace_for_my_company",
    {
      p_workspace_name: workspaceName,
      p_environment: environment,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data as string;
}