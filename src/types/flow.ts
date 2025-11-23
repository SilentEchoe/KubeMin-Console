import type { Node, Edge } from '@xyflow/react';

export type FlowNodeData = {
    label: string;
    description?: string;
    icon?: string;
};

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export const ControlMode = {
    Pointer: 'pointer',
    Hand: 'hand',
} as const;

export type ControlMode = typeof ControlMode[keyof typeof ControlMode];

export type FlowState = {
    nodes: FlowNode[];
    edges: FlowEdge[];
    selectedNodeId: string | null;
    controlMode: ControlMode;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (node: FlowNode) => void;
    setSelectedNode: (id: string | null) => void;
    updateNodeData: (id: string, data: Partial<FlowNodeData>) => void;
    setControlMode: (mode: ControlMode) => void;
};
