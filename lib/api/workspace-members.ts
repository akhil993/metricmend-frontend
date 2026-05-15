import { fetchJsonWithAuth } from "@/lib/api/fetch";

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  company_id: string;
  user_id: string;
  role: string;
  status: string;
  invited_by: string | null;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string | null;
  } | null;
};

export type AddWorkspaceMemberPayload = {
  company_id: string;
  user_id: string;
  role: string;
};

export async function getWorkspaceMembers(
  workspaceId: string
) {
  return fetchJsonWithAuth<WorkspaceMember[]>(
    `/api/workspaces/${workspaceId}/members`
  );
}

export async function addWorkspaceMember(
  workspaceId: string,
  payload: AddWorkspaceMemberPayload
) {
  return fetchJsonWithAuth<WorkspaceMember>(
    `/api/workspaces/${workspaceId}/members`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  memberId: string,
  role: string
) {
  return fetchJsonWithAuth<WorkspaceMember>(
    `/api/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        role,
      }),
    }
  );
}

export async function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
) {
  return fetchJsonWithAuth<{
    success: boolean;
  }>(
    `/api/workspaces/${workspaceId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
}

export type WorkspacePermissions = {
  workspace_id: string;
  role: string | null;
  can_manage_members: boolean;
};

export async function getWorkspacePermissions(
  workspaceId: string
) {
  return fetchJsonWithAuth<WorkspacePermissions>(
    `/api/workspaces/${workspaceId}/permissions`
  );
}