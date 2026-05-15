"use client";

import ConnectionShell from "@/components/connections/ConnectionShell";
import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

export default function LaunchpadConnectionsPage() {
  const { activeWorkspace } = useAppWorkspace();

  return (
    <ConnectionShell
      workspaceId={activeWorkspace.workspace_id}
      workspaceName={activeWorkspace.workspace_name}
    />
  );
}