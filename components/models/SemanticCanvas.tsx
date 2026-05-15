"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "reactflow";

import "reactflow/dist/style.css";

import ModelNode from "./ModelNode";

type Props = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
  onConnect?: (connection: Connection) => void;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
};

const semanticNodeTypes: NodeTypes = {
  semanticTable: ModelNode,
};

export default function SemanticCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onEdgeClick,
  onConnect,
  onNodeDragStop,
}: Props) {
  const styledNodes = useMemo<Node[]>(
    () =>
      nodes.map((node) => ({
        ...node,
        type: "semanticTable",
      })),
    [nodes]
  );

  return (
    <ReactFlowProvider>
      <div className="h-full w-full bg-[#071018]">
        <ReactFlow
          nodes={styledNodes}
          edges={edges}
          nodeTypes={semanticNodeTypes}
          fitView
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={onEdgeClick}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          className="bg-[#071018]"
        >
          <MiniMap />
          <Controls />
          <Background gap={24} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}