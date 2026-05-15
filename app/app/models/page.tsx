"use client";

import ModelsShell from "@/components/models/ModelsShell";
import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

export default function ModelsPage() {
  const { activeWorkspace } = useAppWorkspace();

  return (
    <ModelsShell
      workspaceId={activeWorkspace.workspace_id}
      workspaceName={activeWorkspace.workspace_name}
    />
  );
}