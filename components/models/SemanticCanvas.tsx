"use client";

import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
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
  return (
    <ReactFlowProvider>
      <SemanticCanvasInner
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
      />
    </ReactFlowProvider>
  );
}

function SemanticCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onEdgeClick,
  onConnect,
  onNodeDragStop,
}: Props) {
  const { fitView } = useReactFlow();

  const styledNodes = useMemo<Node[]>(
    () =>
      nodes.map((node) => ({
        ...node,
        type: "semanticTable",
      })),
    [nodes]
  );

  useEffect(() => {
    if (!styledNodes.length) return;

    const frame = window.requestAnimationFrame(() => {
      fitView({
        padding: 0.18,
        includeHiddenNodes: false,
        duration: 250,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fitView, styledNodes.length, edges.length]);

  return (
    <div className="h-full w-full bg-[#071018]">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        nodeTypes={semanticNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.15}
        maxZoom={1.6}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        className="bg-[#071018]"
      >
        <MiniMap
          nodeColor={(node) =>
            node.data?.table?.table_role === "fact" ? "#06b6d4" : "#8b5cf6"
          }
          maskColor="rgba(7, 16, 24, 0.72)"
        />
        <Controls />
        <Background color="#1f3a46" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}
