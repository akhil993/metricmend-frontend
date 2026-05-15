"use client";

import { createContext, useContext } from "react";
import type { MyWorkspace } from "@/lib/api/workspaces";

type AppWorkspaceContextValue = {
  workspaces: MyWorkspace[];
  activeWorkspace: MyWorkspace;
  setActiveWorkspace: (workspace: MyWorkspace) => void;
};

const AppWorkspaceContext = createContext<AppWorkspaceContextValue | null>(null);

export function AppWorkspaceProvider({
  value,
  children,
}: {
  value: AppWorkspaceContextValue;
  children: React.ReactNode;
}) {
  return (
    <AppWorkspaceContext.Provider value={value}>
      {children}
    </AppWorkspaceContext.Provider>
  );
}

export function useAppWorkspace() {
  const context = useContext(AppWorkspaceContext);

  if (!context) {
    throw new Error("useAppWorkspace must be used inside AppWorkspaceProvider");
  }

  return context;
}