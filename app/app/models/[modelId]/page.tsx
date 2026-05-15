"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
  updateModelLayout,
  type SemanticModelDetail,
} from "@/lib/api/models";

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.modelId as string;

  const [modelDetail, setModelDetail] = useState<SemanticModelDetail | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadModel() {
      setLoading(true);
      setMessage(null);

      try {
        const response = await getModelDetail(modelId);
        setModelDetail(response);
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