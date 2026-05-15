"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";

import SemanticCanvas from "@/components/models/SemanticCanvas";
import {
  archiveRelationship,
  autoDetectRelationships,
  createRelationship,
  updateRelationship,
  getModelDetail,
  type SemanticModelColumn,
  type SemanticModelDetail,
  type SemanticModelTable,
} from "@/lib/api/models";

type ActivePanel = "none" | "manual" | "manage";

export default function ModelRelationshipsPage() {
  const params = useParams<{ modelId: string }>();
  const modelId = params.modelId;

  const [detail, setDetail] = useState<SemanticModelDetail | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>("none");
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [fromTableId, setFromTableId] = useState("");
  const [fromColumnId, setFromColumnId] = useState("");
  const [toTableId, setToTableId] = useState("");
  const [toColumnId, setToColumnId] = useState("");

  const factTables = useMemo(
    () => detail?.tables.filter((table) => table.table_role === "fact") ?? [],
    [detail]
  );

  const dimensionTables = useMemo(
    () => detail?.tables.filter((table) => table.table_role === "dimension") ?? [],
    [detail]
  );

  function columnsForTable(tableId: string): SemanticModelColumn[] {
    return detail?.model_columns.filter((column) => column.model_table_id === tableId) ?? [];
  }

  function tableName(tableId: string) {
    return detail?.tables.find((table) => table.id === tableId)?.display_name ?? "Unknown table";
  }

  function columnName(columnId?: string) {
    return detail?.model_columns.find((column) => column.id === columnId)?.source_column ?? "Unknown column";
  }

  async function loadModel() {
    if (!modelId) return;

    setLoading(true);

    try {
      const modelDetail = await getModelDetail(modelId);
      setDetail(modelDetail);

      const layoutByTableId = new Map(
        modelDetail.layouts.map((layout) => [layout.model_table_id, layout])
      );

      const dimensions = modelDetail.tables.filter(
        (table) => table.table_role === "dimension"
      );

      const loadedNodes: Node[] = modelDetail.tables.map((table) => {
        const layout = layoutByTableId.get(table.id);
        const dimensionIndex = dimensions.findIndex((dimension) => dimension.id === table.id);

        return {
          id: table.id,
          type: "default",
          position: {
            x:
              layout?.x_position ??
              (table.table_role === "fact"
                ? 720
                : dimensionIndex % 2 === 0
                  ? 220
                  : 1180),
            y:
              layout?.y_position ??
              (table.table_role === "fact"
                ? 360
                : 120 + Math.floor(dimensionIndex / 2) * 280),
          },
          data: {
            label: table.display_name,
            table: {
              ...table,
              columns: modelDetail.model_columns.filter(
                (column) => column.model_table_id === table.id
              ),
            },
          },
        };
      });

      const loadedEdges: Edge[] = modelDetail.relationships.map((relationship) => {
        const sourceNode = loadedNodes.find((node) => node.id === relationship.from_table_id);
        const targetNode = loadedNodes.find((node) => node.id === relationship.to_table_id);

        const targetIsLeftOfSource =
          (targetNode?.position.x ?? 0) < (sourceNode?.position.x ?? 0);

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

      setNodes(loadedNodes);
      setEdges(loadedEdges);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load relationships.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModel();
  }, [modelId]);

  async function handleAutoDetect() {
    if (!modelId) return;

    setDetecting(true);
    setMessage(null);

    try {
      const detected = await autoDetectRelationships(modelId);
      setMessage(`Detected ${detected.length} possible relationships.`);
      await loadModel();
      setActivePanel("manage");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to auto-detect relationships.");
    } finally {
      setDetecting(false);
    }
  }
  function handleEditRelationship(relationshipId: string) {
  const relationship = detail?.relationships.find(
    (item) => item.id === relationshipId
  );

  if (!relationship) return;

  setSelectedRelationshipId(relationship.id);
  setFromTableId(relationship.from_table_id);
  setFromColumnId(relationship.from_column_id ?? "");
  setToTableId(relationship.to_table_id);
  setToColumnId(relationship.to_column_id ?? "");
  setActivePanel("manual");
}

  async function handleCreateManualRelationship() {
    if (!modelId) return;

    setSaving(true);
    setMessage(null);

    try {
      if (!fromTableId || !fromColumnId || !toTableId || !toColumnId) {
        throw new Error("Select both tables and columns.");
      }
    if (selectedRelationshipId) {
      await updateRelationship(selectedRelationshipId, {
        from_table_id: fromTableId,
        from_column_id: fromColumnId,
        to_table_id: toTableId,
        to_column_id: toColumnId,
        relationship_type: "many_to_one",
        filter_direction: "single",
      });

    setMessage("Relationship updated.");
    } else {
    await createRelationship({
      model_id: modelId,
      from_table_id: fromTableId,
      from_column_id: fromColumnId,
      to_table_id: toTableId,
      to_column_id: toColumnId,
      relationship_type: "many_to_one",
      filter_direction: "single",
      is_auto_detected: false,
    });

  setMessage("Manual relationship created.");
}

      setMessage("Manual relationship created.");
      setFromTableId("");
      setFromColumnId("");
      setToTableId("");
      setToColumnId("");
      setActivePanel("manage");
      await loadModel();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create relationship.");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchiveRelationship(relationshipId: string) {
    setSaving(true);
    setMessage(null);

    try {
      await archiveRelationship(relationshipId);
      setMessage("Relationship removed.");
      setSelectedRelationshipId(null);
      await loadModel();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to remove relationship.");
    } finally {
      setSaving(false);
    }
  }

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((currentEdges) => addEdge(connection, currentEdges));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading semantic relationships...</div>;
  }

  const selectedRelationship = detail?.relationships.find(
    (relationship) => relationship.id === selectedRelationshipId
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Semantic Relationships
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              {detail?.model.name ?? "Relationship Builder"}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Build governed star-schema relationships for Mira.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={detecting}
              onClick={handleAutoDetect}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {detecting ? "Detecting..." : "Auto Detect"}
            </button>

            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "manual" ? "none" : "manual")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Manual
            </button>

            <button
              type="button"
              onClick={() => setActivePanel(activePanel === "manage" ? "none" : "manage")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Manage
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
            {message}
          </div>
        )}
      </section>

      {activePanel === "manual" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Add manual relationship
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <select
              value={fromTableId}
              onChange={(event) => {
                setFromTableId(event.target.value);
                setFromColumnId("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Fact table</option>
              {factTables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.display_name}
                </option>
              ))}
            </select>

            <select
              value={fromColumnId}
              onChange={(event) => setFromColumnId(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Fact column</option>
              {columnsForTable(fromTableId).map((column) => (
                <option key={column.id} value={column.id}>
                  {column.source_column}
                </option>
              ))}
            </select>

            <select
              value={toTableId}
              onChange={(event) => {
                setToTableId(event.target.value);
                setToColumnId("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Dimension table</option>
              {dimensionTables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.display_name}
                </option>
              ))}
            </select>

            <select
              value={toColumnId}
              onChange={(event) => setToColumnId(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Dimension column</option>
              {columnsForTable(toTableId).map((column) => (
                <option key={column.id} value={column.id}>
                  {column.source_column}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleCreateManualRelationship}
            className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save relationship"}
          </button>
        </section>
      )}

      {activePanel === "manage" && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Manage relationships
          </h2>

          <div className="mt-4 space-y-3">
            {detail?.relationships.length ? (
              detail.relationships.map((relationship) => (
                <div
                  key={relationship.id}
                  className={[
                    "rounded-2xl border p-4 text-sm",
                    selectedRelationshipId === relationship.id
                      ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/30 dark:bg-cyan-300/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.035]",
                  ].join(" ")}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-slate-700 dark:text-slate-200">
                      <span className="font-semibold">{tableName(relationship.from_table_id)}</span>
                      .{columnName(relationship.from_column_id)}
                      <span className="px-2 text-cyan-600 dark:text-cyan-300">→</span>
                      <span className="font-semibold">{tableName(relationship.to_table_id)}</span>
                      .{columnName(relationship.to_column_id)}
                    </div>
                    <button
                    type="button"
                      onClick={() => handleEditRelationship(relationship.id)}
                      className="rounded-lg border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-300/20 dark:text-cyan-200 dark:hover:bg-cyan-300/10"
                      >
                         Edit
                      </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleArchiveRelationship(relationship.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-400/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No relationships created yet.
              </p>
            )}
          </div>
        </section>
      )}

      {selectedRelationship && (
        <section className="rounded-3xl border border-cyan-300/30 bg-cyan-50 p-5 text-sm shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
          <p className="font-semibold">Selected relationship</p>
          <p className="mt-2">
            {tableName(selectedRelationship.from_table_id)}.
            {columnName(selectedRelationship.from_column_id)} →{" "}
            {tableName(selectedRelationship.to_table_id)}.
            {columnName(selectedRelationship.to_column_id)}
          </p>
        </section>
      )}

      <div className="h-[78vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <SemanticCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={(_, edge) => {
            setSelectedRelationshipId(edge.id);
            setActivePanel("manage");
          }}
        />
      </div>
    </div>
  );
}