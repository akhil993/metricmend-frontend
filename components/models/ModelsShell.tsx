"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Info,
  ShieldCheck,
} from "lucide-react";

import ConnectionPicker from "./ConnectionPicker";
import DatabasePicker from "./DatabasePicker";
import SelectedModelTables from "./SelectedModelTables";
import TableSelector from "./TableSelector";

import {
  getWorkspaceConnections,
  type SavedConnection,
} from "@/lib/api/connections";

import {
  addModelTable,
  archiveSemanticModel,
  createSemanticModel,
  getConnectionDatabases,
  getConnectionTables,
  getWorkspaceModels,
  updateSemanticModel,
  type SelectedModelTable,
  type SemanticModel,
  type SourceTable,
} from "@/lib/api/models";

import { getWorkspaceManagementSummary } from "@/lib/api/workspaces";
import { getModelSecurityStatus } from "@/lib/api/security";

type Props = {
  workspaceId: string;
  workspaceName?: string;
};

export default function ModelsShell({ workspaceId, workspaceName }: Props) {
  const [models, setModels] = useState<SemanticModel[]>([]);
  const [connections, setConnections] = useState<SavedConnection[]>([]);

  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [tables, setTables] = useState<SourceTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<SelectedModelTable[]>([]);

  const [modelName, setModelName] = useState("Sales semantic model");
  const [modelDescription, setModelDescription] = useState("");

  const [editingModel, setEditingModel] = useState<SemanticModel | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [loadingConnections, setLoadingConnections] = useState(true);
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modelActionId, setModelActionId] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [maxModels, setMaxModels] = useState<number | null>(null);
  const [modelSecurityReady, setModelSecurityReady] = useState<
    boolean | null
  >(null);

  const modelLimitReached =
    maxModels !== null && models.length >= maxModels;

  async function loadInitialData() {
    setLoadingConnections(true);
    setMessage(null);

    try {
      const [connectionsData, modelsData, summaryData] = await Promise.all([
        getWorkspaceConnections(workspaceId),
        getWorkspaceModels(workspaceId),
        getWorkspaceManagementSummary(),
      ]);

      setConnections(connectionsData);
      setModels(modelsData);
      setMaxModels(summaryData.limits.max_models);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load models."
      );
    } finally {
      setLoadingConnections(false);
    }
  }

  useEffect(() => {
    if (workspaceId) {
      loadInitialData();
    }
  }, [workspaceId]);

  useEffect(() => {
    let mounted = true;

    getModelSecurityStatus()
      .then((status) => {
        if (mounted) {
          setModelSecurityReady(status.status === "ready");
        }
      })
      .catch(() => {
        if (mounted) {
          setModelSecurityReady(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleConnectionSelect(connectionId: string) {
    setSelectedConnectionId(connectionId);
    setSelectedDatabase("");
    setDatabases([]);
    setTables([]);
    setSelectedTables([]);
    setMessage(null);

    if (!connectionId) return;

    setLoadingDatabases(true);

    try {
      const databaseData = await getConnectionDatabases(connectionId);
      setDatabases(databaseData);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load databases."
      );
    } finally {
      setLoadingDatabases(false);
    }
  }

  async function handleDatabaseSelect(database: string) {
    setSelectedDatabase(database);
    setTables([]);
    setSelectedTables([]);
    setMessage(null);

    if (!database || !selectedConnectionId) return;

    setLoadingTables(true);

    try {
      const tableData = await getConnectionTables(
        selectedConnectionId,
        database
      );
      setTables(tableData);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load tables."
      );
    } finally {
      setLoadingTables(false);
    }
  }

  async function handleSaveModel() {
    setSaving(true);
    setMessage(null);

    try {
      if (modelLimitReached) {
        throw new Error("Model limit reached for your current plan.");
      }

      if (!selectedConnectionId) {
        throw new Error("Select a connection before saving the model.");
      }

      if (!modelName.trim()) {
        throw new Error("Model name is required.");
      }

      if (selectedTables.length === 0) {
        throw new Error("Select at least one table.");
      }

      const factCount = selectedTables.filter(
        (table) => table.table_role === "fact"
      ).length;

      if (factCount === 0) {
        throw new Error("Select at least one fact table.");
      }

      const model = await createSemanticModel({
        workspace_id: workspaceId,
        connection_id: selectedConnectionId,
        name: modelName.trim(),
        description: modelDescription.trim() || null,
        created_by: null,
      });

      for (const table of selectedTables) {
        await addModelTable(model.id, table);
      }

      setMessage("Semantic model saved successfully.");
      setSelectedTables([]);
      setSelectedConnectionId("");
      setSelectedDatabase("");
      setDatabases([]);
      setTables([]);

      await loadInitialData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save model."
      );
    } finally {
      setSaving(false);
    }
  }

  function openEditModel(model: SemanticModel) {
    setEditingModel(model);
    setEditName(model.name);
    setEditDescription(model.description ?? "");
    setEditStatus(model.status || "draft");
    setMessage(null);
  }

  async function handleUpdateModel() {
    if (!editingModel) return;

    setModelActionId(editingModel.id);
    setMessage(null);

    try {
      if (!editName.trim()) {
        throw new Error("Model name is required.");
      }

      await updateSemanticModel(editingModel.id, {
        name: editName.trim(),
        description: editDescription.trim() || null,
        status: editStatus || editingModel.status,
      });

      setEditingModel(null);
      setMessage("Model updated successfully.");

      await loadInitialData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update model."
      );
    } finally {
      setModelActionId(null);
    }
  }

  async function handleArchiveModel(model: SemanticModel) {
    const confirmed = window.confirm(
      `Archive "${model.name}"? This will remove it from the saved models list.`
    );

    if (!confirmed) return;

    setModelActionId(model.id);
    setMessage(null);

    try {
      await archiveSemanticModel(model.id);
      setMessage("Model archived successfully.");

      await loadInitialData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to archive model."
      );
    } finally {
      setModelActionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
          MetricMend Models
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
          Build semantic models from trusted connections
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Select workspace connections, choose source tables, assign fact and
          dimension roles, and prepare a governed model for Mira.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            Current workspace: {workspaceName ?? "Workspace"}
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            Models: {models.length}
            {maxModels === null ? " / Unlimited" : ` / ${maxModels}`}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              modelSecurityReady === false
                ? "border-amber-300/40 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
                : "border-emerald-300/40 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100"
            }`}
          >
            {modelSecurityReady === false ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            Model RLS/OLS{" "}
            {modelSecurityReady === false ? "needs attention" : "active"}
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
          {message}
        </div>
      ) : null}

      {modelLimitReached ? (
        <div className="rounded-2xl border border-amber-300/30 bg-amber-100/50 p-4 text-sm text-amber-800 dark:bg-amber-300/10 dark:text-amber-200">
          Model limit reached for your current plan. Archive an existing model
          or upgrade later to create more semantic models.
        </div>
      ) : null}

      {editingModel ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                Edit semantic model
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                {editingModel.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update model metadata used across Mira, metrics, relationships, and governance.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
              Current status: {editingModel.status || "draft"}
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Model name
                </span>
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  placeholder="Sales semantic model"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description
                </span>
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  rows={4}
                  placeholder="Describe the business purpose, grain, trusted use cases, or owner notes for this model."
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Model status
                </span>
                <select
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                >
                  {!["draft", "active", "disabled"].includes(editingModel.status || "") ? (
                    <option value={editingModel.status}>{editingModel.status}</option>
                  ) : null}
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Edit scope
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    These changes update model metadata only. Tables, columns, relationships, security rules, and metrics stay intact.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-200 pt-3 dark:border-white/10">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                <div className="min-w-0 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  <p>ID: {editingModel.id}</p>
                  <p>Created: {new Date(editingModel.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(editingModel.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={modelActionId === editingModel.id}
              onClick={handleUpdateModel}
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
            >
              {modelActionId === editingModel.id ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => setEditingModel(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Model details
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Model name
                </label>

                <input
                  value={modelName}
                  onChange={(event) => setModelName(event.target.value)}
                  disabled={modelLimitReached}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description
                </label>

                <input
                  value={modelDescription}
                  onChange={(event) =>
                    setModelDescription(event.target.value)
                  }
                  disabled={modelLimitReached}
                  placeholder="Optional"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </div>
            </div>
          </div>

          <ConnectionPicker
            connections={connections}
            selectedConnectionId={selectedConnectionId}
            onSelect={handleConnectionSelect}
          />

          <DatabasePicker
            databases={databases}
            selectedDatabase={selectedDatabase}
            loading={loadingDatabases}
            disabled={!selectedConnectionId || modelLimitReached}
            onSelect={handleDatabaseSelect}
          />

          <TableSelector
            tables={tables}
            selectedDatabase={selectedDatabase}
            loading={loadingTables}
            selectedTables={selectedTables}
            onChange={setSelectedTables}
          />

          <button
            type="button"
            disabled={
              saving || selectedTables.length === 0 || modelLimitReached
            }
            onClick={handleSaveModel}
            className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving model..." : "Save semantic model"}
          </button>
        </div>

        <div className="space-y-5">
          <SelectedModelTables selectedTables={selectedTables} />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Saved models
            </h2>

            <div className="mt-4 space-y-3">
              {loadingConnections ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Loading models...
                </p>
              ) : models.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No models saved yet.
                </p>
              ) : (
                models.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950 dark:text-white">
                          {model.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {workspaceName ?? "Workspace"}
                        </p>

                        {model.description ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                            {model.description}
                          </p>
                        ) : null}

                        <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                          {model.status || "draft"}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/app/models/${model.id}`}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          Open
                        </Link>

                        <Link
                          href={`/app/models/${model.id}/metrics`}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:text-emerald-200 dark:hover:bg-emerald-300/10"
                        >
                          Metrics
                        </Link>

                        <Link
                          href={`/app/models/${model.id}/relationships`}
                          className="rounded-lg border border-cyan-200 px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-300/20 dark:text-cyan-200 dark:hover:bg-cyan-300/10"
                        >
                          Relationships
                        </Link>

                        <Link
                          href={`/app/models/${model.id}/security`}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-300/20 dark:text-emerald-200 dark:hover:bg-emerald-300/10"
                        >
                          Security
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEditModel(model)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={modelActionId === model.id}
                          onClick={() => handleArchiveModel(model)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
