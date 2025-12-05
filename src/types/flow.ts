import type { Node, Edge } from '@xyflow/react';

export type EnvironmentVariable = {
    key: string;
    value: string;
    type?: 'String' | 'Number' | 'Secret';
    isSecret?: boolean;
    description?: string;
};

export type PropertyItem = {
    id: string;
    value: string;
    placeholder?: string;
};

export type EnvConfigItem = {
    id: string;
    key: string;
    value: string;
};

export interface TraitEnv {
    name: string;
    valueFrom?: {
        secret?: {
            name: string;
            key: string;
        };
        field?: {
            fieldPath: string;
        };
    };
}

export interface TraitProbe {
    type: 'liveness' | 'readiness';
    exec?: {
        command: string[];
    };
    initialDelaySeconds?: number;
    periodSeconds?: number;
    timeoutSeconds?: number;
}

export interface TraitStorage {
    type: 'persistent' | 'ephemeral' | 'config';
    name: string;
    mountPath: string;
    subPath?: string;
    size?: string;
    sourceName?: string; // For config type
}

export interface TraitContainer {
    name: string;
    image?: string;
    command?: string[];
    properties?: {
        image?: string;
        command?: string[];
        env?: Record<string, string>;
    };
    traits?: Traits;
}

export interface Traits {
    envs?: TraitEnv[];
    probes?: TraitProbe[];
    storage?: TraitStorage[];
    sidecar?: TraitContainer[];
    init?: TraitContainer[];
}

// Config data item (key-value pair for config files like master.cnf, slave.cnf)
export interface ConfigDataItem {
    id: string;
    key: string;      // filename, e.g., "master.cnf"
    value: string;    // file content
}

// Secret data item (key-value pair for secrets)
export interface SecretDataItem {
    id: string;
    key: string;      // secret key, e.g., "MYSQL_ROOT_PASSWORD"
    value: string;    // secret value (base64 encoded)
}

export interface FlowNodeData extends Record<string, unknown> {
    name?: string;
    label: string;
    description?: string;
    icon?: string;
    componentType?: 'webservice' | 'store' | 'config' | 'secret' | 'config-secret';
    originalType?: 'config' | 'secret' | 'store' | 'webservice';  // Original API type
    image?: string;
    namespace?: string;
    replicas?: number;
    content?: string;
    environmentVariables?: EnvironmentVariable[];
    properties?: any[];
    envConfig?: any[];
    configData?: ConfigDataItem[];   // For config type: properties.conf
    secretData?: SecretDataItem[];   // For secret type: properties.secret
    enabled?: boolean;
    ports?: string[];
    traits?: Traits;
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

// Component deployment status types
export type ComponentDeployStatus = 'completed' | 'wait' | 'waiting' | 'running' | 'error';

export interface ComponentStatus {
    name: string;
    type: string;
    status: ComponentDeployStatus;
    startTime?: number;
    endTime?: number;
}

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
    panelMenu: { top: number; left: number; edgeId?: string } | null;
    clipboard: FlowNode | null;
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: FlowEdge[]) => void;
    clearNodes: () => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (node: FlowNode) => void;
    insertNodeOnEdge: (edgeId: string, node: FlowNode) => void;
    setSelectedNode: (id: string | null) => void;
    updateNodeData: (id: string, data: Partial<FlowNodeData>) => void;
    setControlMode: (mode: ControlMode) => void;
    setPanelMenu: (menu: { top: number; left: number; edgeId?: string } | null) => void;
    deleteSelectedElements: () => void;
    copyNode: () => void;
    pasteNode: () => void;
    showEnvPanel: boolean;
    setShowEnvPanel: (show: boolean) => void;
    environmentVariables: EnvironmentVariable[];
    setEnvironmentVariables: (vars: EnvironmentVariable[]) => void;
    envSecrets: Record<string, string>;
    setEnvSecrets: (secrets: Record<string, string>) => void;
    // Preview mode state
    isPreviewMode: boolean;
    setPreviewMode: (mode: boolean) => void;
    taskId: string | null;
    setTaskId: (id: string | null) => void;
    componentStatuses: Record<string, ComponentStatus>;
    setComponentStatuses: (statuses: Record<string, ComponentStatus>) => void;
    clearPreviewState: () => void;
};
