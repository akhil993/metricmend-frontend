"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  applyNodeChanges,
  MarkerType,
  type Edge,
  type Node,
  type NodeChange,
} from "reactflow";

import SemanticCanvas from "@/components/models/SemanticCanvas";
import {
  getModelDetail,
  getModelSecuritySettings,
  updateModelLayout,
  updateModelSecuritySettings,
  type SemanticModelDetail,
  type SemanticModelSecuritySettings,
} from "@/lib/api/models";

function defaultSecuritySettings(
  modelId: string
): SemanticModelSecuritySettings {
  return {
    model_id: modelId,
    configured: false,
    rls_enabled: true,
    ols_enabled: true,
    mira_access_enabled: true,
    metric_creation_enabled: true,
    row_access_mode: "workspace_members",
    object_access_mode: "parent_inheritance",
    updated_by: null,
    created_at: null,
    updated_at: null,
  };
}

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.modelId as string;

  const [modelDetail, setModelDetail] = useState<SemanticModelDetail | null>(null);
  const [securitySettings, setSecuritySettings] =
    useState<SemanticModelSecuritySettings | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadModel() {
      setLoading(true);
      setMessage(null);

      try {
        const detailResponse = await getModelDetail(modelId);
        setModelDetail(detailResponse);

        try {
          const securityResponse = await getModelSecuritySettings(modelId);
          setSecuritySettings(securityResponse);
        } catch (securityError) {
          console.warn(
            "Model security settings are not ready:",
            securityError
          );
          setSecuritySettings(defaultSecuritySettings(modelId));
          setSecurityMessage(
            "Model security settings are not enabled yet. Use Enable model security after the latest Supabase SQL has been applied."
          );
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load semantic model."
        );
      } finally {
        setLoading(false);
      }
    }

    if (modelId) {
      loadModel();
    }
  }, [modelId]);

  const nodes: Node[] = useMemo(() => {
    if (!modelDetail) {
      return [];
    }

    const dimensions = modelDetail.tables.filter(
      (table) => table.table_role === "dimension"
    );

    return modelDetail.tables.map((table) => {
      const dimensionIndex = dimensions.findIndex(
        (dimension) => dimension.id === table.id
      );

      const savedLayout = modelDetail.layouts.find(
        (layout) => layout.model_table_id === table.id
      );

      return {
        id: table.id,
        type: "default",
        position: {
          x:
            savedLayout?.x_position ??
            (table.table_role === "fact"
              ? 720
              : dimensionIndex % 2 === 0
                ? 220
                : 1180),
          y:
            savedLayout?.y_position ??
            (table.table_role === "fact"
              ? 360
              : 120 + Math.floor(dimensionIndex / 2) * 280),
        },
        data: {
          label: table.display_name,
          table: {
            ...table,
            columns:
              modelDetail.model_columns?.filter(
                (column) => column.model_table_id === table.id
              ) ?? [],
          },
        },
      };
    });
  }, [modelDetail]);

  useEffect(() => {
    setCanvasNodes(nodes);
  }, [nodes]);

  const edges: Edge[] = useMemo(() => {
    if (!modelDetail) {
      return [];
    }

    return modelDetail.relationships.map((relationship) => {
      const sourceNode = nodes.find(
        (node) => node.id === relationship.from_table_id
      );

      const targetNode = nodes.find(
        (node) => node.id === relationship.to_table_id
      );

      const sourceX = sourceNode?.position.x ?? 0;
      const targetX = targetNode?.position.x ?? 0;
      const targetIsLeftOfSource = targetX < sourceX;

      return {
        id: relationship.id,
        source: relationship.from_table_id,
        target: relationship.to_table_id,
        sourceHandle: targetIsLeftOfSource ? "left-source" : "right-source",
        targetHandle: targetIsLeftOfSource ? "right-target" : "left-target",
        type: "straight",
        animated: false,
        label: "",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          strokeWidth: 2,
        },
      };
    });
  }, [modelDetail, nodes]);

  function handleNodesChange(changes: NodeChange[]) {
    setCanvasNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }

  async function handleNodeDragStop(_: React.MouseEvent, node: Node) {
    try {
      await updateModelLayout(modelId, {
        model_table_id: node.id,
        x_position: node.position.x,
        y_position: node.position.y,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function updateSecurityDraft(
    patch: Partial<SemanticModelSecuritySettings>
  ) {
    if (!securitySettings) {
      return;
    }

    setSecuritySettings({
      ...securitySettings,
      ...patch,
    });
    setSecurityMessage(null);
  }

  async function handleSaveSecuritySettings() {
    if (!securitySettings) {
      return;
    }

    setSavingSecurity(true);
    setSecurityMessage(null);

    try {
      const saved = await updateModelSecuritySettings(modelId, {
        rls_enabled: true,
        ols_enabled: true,
        mira_access_enabled: securitySettings.mira_access_enabled,
        metric_creation_enabled:
          securitySettings.metric_creation_enabled,
        row_access_mode: securitySettings.row_access_mode,
        object_access_mode: securitySettings.object_access_mode,
      });

      setSecuritySettings(saved);
      setSecurityMessage(
        saved.configured
          ? "Model security is enabled."
          : "Model security settings saved."
      );
    } catch (error) {
      setSecurityMessage(
        error instanceof Error
          ? error.message
          : "Failed to save model security settings."
      );
    } finally {
      setSavingSecurity(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading semantic model...</div>;
  }

  if (message) {
    return <div className="p-6 text-sm text-red-500">{message}</div>;
  }

  if (!modelDetail) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Semantic Model
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              {modelDetail.model.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {modelDetail.model.description ?? "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/app/models/${modelId}/security`}
              className="rounded-xl border border-emerald-300/30 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100 dark:hover:bg-emerald-300/20"
            >
              Security
            </a>

            <a
              href={`/app/models/${modelId}/relationships`}
              className="rounded-xl border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100 dark:hover:bg-cyan-300/20"
            >
              Relationships
            </a>

            <div className="rounded-full border border-cyan-300/30 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              {modelDetail.tables.length} tables
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Model Security
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              RLS and OLS controls
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              This model is protected by workspace RLS and object-level
              inheritance for tables, columns, relationships, metrics,
              versions, and Mira artifacts.
            </p>
          </div>

          <button
            type="button"
            disabled={!securitySettings || savingSecurity}
            onClick={handleSaveSecuritySettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSecurity
              ? "Saving..."
              : securitySettings?.configured
                ? "Save security"
                : "Enable model security"}
          </button>
        </div>

        {securitySettings && !securitySettings.configured ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">
                Model security has not been enabled for this model yet.
              </p>
              <p className="mt-1 leading-6">
                Use Enable model security to add RLS/OLS settings for
                this model. Database-level RLS policies still come from
                the enterprise baseline SQL.
              </p>
            </div>
          </div>
        ) : null}

        {securityMessage ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
            {securityMessage}
          </div>
        ) : null}

        {securitySettings ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <LockedSecurityControl
              title="Row-level security"
              description="Workspace membership is enforced for this model and its model records."
              configured={securitySettings.configured}
            />

            <LockedSecurityControl
              title="Object-level security"
              description="Tables, columns, relationships, metrics, and versions inherit access from this model."
              configured={securitySettings.configured}
            />

            <ToggleSecurityControl
              title="Allow Mira on this model"
              description="Mira can answer questions using this governed semantic model."
              checked={securitySettings.mira_access_enabled}
              onChange={(checked) =>
                updateSecurityDraft({
                  mira_access_enabled: checked,
                })
              }
            />

            <ToggleSecurityControl
              title="Allow metric creation"
              description="Builders can create governed metrics from this semantic model."
              checked={securitySettings.metric_creation_enabled}
              onChange={(checked) =>
                updateSecurityDraft({
                  metric_creation_enabled: checked,
                })
              }
            />
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Loading model security settings...
          </p>
        )}
      </section>

      <div className="h-[78vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <SemanticCanvas
          nodes={canvasNodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={() => { }}
          onConnect={() => { }}
          onNodeDragStop={handleNodeDragStop}
        />
      </div>
    </div>
  );
}

function LockedSecurityControl({
  title,
  description,
  configured,
}: {
  title: string;
  description: string;
  configured: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-100">
          <Lock className="h-3.5 w-3.5" />
          {configured ? "On" : "Ready"}
        </span>
      </div>
    </div>
  );
}

function ToggleSecurityControl({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
            checked
              ? "bg-emerald-600"
              : "bg-slate-300 dark:bg-white/20"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm transition ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {checked ? <CheckCircle2 className="h-4 w-4" /> : null}
          </span>
        </button>
      </div>
    </div>
  );
}
