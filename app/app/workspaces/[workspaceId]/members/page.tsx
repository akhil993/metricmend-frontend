"use client";

import { useEffect, useState } from "react";

import { WorkspaceMembersPage } from "@/components/workspaces/members/WorkspaceMembersPage";
import {
  getWorkspaceMembers,
  getWorkspacePermissions,
  type WorkspaceMember,
  type WorkspacePermissions,
} from "@/lib/api/workspace-members";

type WorkspaceMembersRouteProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default function WorkspaceMembersRoute({
  params,
}: WorkspaceMembersRouteProps) {
  const [workspaceId, setWorkspaceId] = useState("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [permissions, setPermissions] =
    useState<WorkspacePermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const resolvedParams = await params;
      setWorkspaceId(resolvedParams.workspaceId);

      const [membersData, permissionsData] = await Promise.all([
        getWorkspaceMembers(resolvedParams.workspaceId),
        getWorkspacePermissions(resolvedParams.workspaceId),
      ]);

      setMembers(membersData);
      setPermissions(permissionsData);
      setLoading(false);
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
        Loading workspace members...
      </div>
    );
  }

  return (
    <WorkspaceMembersPage
      workspaceId={workspaceId}
      initialMembers={members}
      canManageMembers={permissions?.can_manage_members ?? false}
    />
  );
}