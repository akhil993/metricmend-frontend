"use client";

import { useEffect, useMemo, useState } from "react";
import ConnectionDrawer from "./ConnectionDrawer";
import ConnectorGrid from "./ConnectorGrid";
import SavedConnectionsList from "./SavedConnectionsList";
import {
  getConnectorRegistry,
  getWorkspaceConnections,
  type ConnectorRegistryItem,
  type SavedConnection,
} from "@/lib/api/connections";

type Props = {
  workspaceId: string;
  workspaceName?: string;
};

export default function ConnectionShell({ workspaceId, workspaceName }: Props) {
  const [connectors, setConnectors] = useState<ConnectorRegistryItem[]>([]);
  const [connections, setConnections] = useState<SavedConnection[]>([]);
  const [selectedConnector, setSelectedConnector] =
    useState<ConnectorRegistryItem | null>(null);
  const [editingConnection, setEditingConnection] =
  useState<SavedConnection | null>(null);
  const [loading, setLoading] = useState(true);

  const availableConnectors = useMemo(
    () => connectors.filter((connector) => connector.status === "available"),
    [connectors]
  );

  const loadData = async () => {
    setLoading(true);

    try {
      const [registryData, savedData] = await Promise.all([
        getConnectorRegistry(),
        getWorkspaceConnections(workspaceId),
      ]);

      setConnectors(registryData);
      setConnections(savedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      loadData();
    }
  }, [workspaceId]);
  const editingConnector =
  editingConnection
    ? connectors.find(
        (item) => item.key === editingConnection.connector_key
      ) ?? null
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              MetricMend Connections
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              Connect your data sources
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Add secure workspace-level connections for models, metrics, and
              Mira-powered analysis.
            </p>
             <div className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">

    Current workspace: {workspaceName ?? "Workspace"}

  </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Available connectors
          </h2>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              Loading connectors...
            </div>
          ) : (
            <div className="min-h-[200px]">
  <ConnectorGrid
    connectors={availableConnectors}
    onSelect={setSelectedConnector}
  />
</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Saved connections
          </h2>

          <SavedConnectionsList
          connections={connections}
          workspaceName={workspaceName}
          onEdit={setEditingConnection}
          />
        </div>
      </section>

      <ConnectionDrawer
        open={Boolean(selectedConnector || editingConnection)}
        connector={selectedConnector ?? editingConnector}
        editingConnection={editingConnection}
        workspaceId={workspaceId}
        onClose={() => {
        setSelectedConnector(null);
        setEditingConnection(null);
      }}
      onSaved={() => {
        setSelectedConnector(null);
        setEditingConnection(null);
        loadData();
      }}
      />
    </div>
  );
}