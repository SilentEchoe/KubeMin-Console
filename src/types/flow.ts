import type { Node, Edge } from '@xyflow/react';

export type EnvironmentVariable = {
    key: string;
    value: string;
    isSecret?: boolean;
    description?: string;
};

export type FlowNodeData = {
    label: string;
    description?: string;
    icon?: string;
    componentType?: string;
    image?: string;
    namespace?: string;
    replicas?: number;
    content?: string;
    environmentVariables?: EnvironmentVariable[];
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
    panelMenu: { top: number; left: number } | null;
    clipboard: FlowNode | null;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (node: FlowNode) => void;
    setSelectedNode: (id: string | null) => void;
    updateNodeData: (id: string, data: Partial<FlowNodeData>) => void;
    setControlMode: (mode: ControlMode) => void;
    setPanelMenu: (menu: { top: number; left: number } | null) => void;
    deleteSelectedElements: () => void;
    copyNode: () => void;
    pasteNode: () => void;
    showEnvPanel: boolean;
    setShowEnvPanel: (show: boolean) => void;
    environmentVariables: EnvironmentVariable[];
    setEnvironmentVariables: (vars: EnvironmentVariable[]) => void;
    envSecrets: Record<string, string>;
    setEnvSecrets: (secrets: Record<string, string>) => void;
};
