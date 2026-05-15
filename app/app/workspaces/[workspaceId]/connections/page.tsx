"use client";

import { useParams } from "next/navigation";
import ConnectionShell from "@/components/connections/ConnectionShell";

export default function WorkspaceConnectionsPage() {
  const params = useParams();
  const workspaceId = String(params.workspaceId);

  return (
    <ConnectionShell
      workspaceId={workspaceId}
      workspaceName="Workspace"
    />
  );
}