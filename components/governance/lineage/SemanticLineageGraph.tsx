"use client";

import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";

type Props = {
  lineage?: any;
  loading?: boolean;
};

function buildNodes(lineage?: any) {
  const metric = lineage?.metric;
  const model = lineage?.model;

  if (metric) {
    return [
      {
        id: "metric",
        position: { x: 220, y: 60 },
        data: {
          label:
            metric.display_name ??
            metric.name ??
            "Semantic Metric",
        },
      },
      {
        id: "dependencies",
        position: { x: 220, y: 250 },
        data: {
          label: "Metric Dependencies",
        },
      },
    ];
  }

  if (model) {
    return [
      {
        id: "model",
        position: { x: 220, y: 60 },
        data: {
          label: model.name ?? "Semantic Model",
        },
      },
      {
        id: "relationships",
        position: { x: 220, y: 250 },
        data: {
          label: "Model Relationships",
        },
      },
    ];
  }

  return [
    {
      id: "semantic-assets",
      position: { x: 220, y: 100 },
      data: { label: "Select Certified Asset" },
    },
    {
      id: "governance",
      position: { x: 220, y: 280 },
      data: { label: "Governance Lineage" },
    },
  ];
}

function buildEdges(lineage?: any) {
  if (lineage?.metric) {
    return [
      {
        id: "dependencies-to-metric",
        source: "dependencies",
        target: "metric",
        animated: true,
      },
    ];
  }

  if (lineage?.model) {
    return [
      {
        id: "relationships-to-model",
        source: "relationships",
        target: "model",
        animated: true,
      },
    ];
  }

  return [
    {
      id: "semantic-assets-to-governance",
      source: "semantic-assets",
      target: "governance",
      animated: true,
    },
  ];
}

export default function SemanticLineageGraph({
  lineage,
  loading,
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Semantic Lineage
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {loading
            ? "Loading governed lineage..."
            : "Inspect certified semantic dependencies and governance relationships."}
        </p>
      </div>

      <ReactFlowProvider>
        <div className="h-[520px] w-full overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/10">
          <ReactFlow
            nodes={buildNodes(lineage)}
            edges={buildEdges(lineage)}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}