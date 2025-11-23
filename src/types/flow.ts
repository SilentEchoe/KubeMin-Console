import type { Node, Edge } from '@xyflow/react';

export type FlowNodeData = {
    label: string;
    description?: string;
    icon?: string;
};

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export type FlowState = {
    nodes: FlowNode[];
    edges: FlowEdge[];
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (node: FlowNode) => void;
};
