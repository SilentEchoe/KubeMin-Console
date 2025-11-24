import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import type {
    Connection,
    EdgeChange,
    NodeChange,
} from '@xyflow/react';
import type { FlowState, FlowNode, FlowNodeData } from '../types/flow';
import { ControlMode } from '../types/flow';

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    controlMode: ControlMode.Pointer,
    panelMenu: null,
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as FlowNode[],
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    addNode: (node: FlowNode) => {
        set({
            nodes: [...get().nodes, node],
        });
    },
    setSelectedNode: (id: string | null) => {
        set({ selectedNodeId: id });
    },
    updateNodeData: (id: string, data: Partial<FlowNodeData>) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: { ...node.data, ...data },
                    };
                }
                return node;
            }),
        });
    },
    setControlMode: (mode: ControlMode) => {
        set({ controlMode: mode });
    },
    setPanelMenu: (menu) => {
        set({ panelMenu: menu });
    },
    deleteSelectedElements: () => {
        const { nodes, edges, selectedNodeId } = get();
        const nodesToDelete = nodes.filter((node) => node.selected || node.id === selectedNodeId);
        const edgesToDelete = edges.filter((edge) => edge.selected);

        if (nodesToDelete.length === 0 && edgesToDelete.length === 0) {
            return;
        }

        const nodeIdsToDelete = new Set(nodesToDelete.map((node) => node.id));

        set({
            nodes: nodes.filter((node) => !nodeIdsToDelete.has(node.id)),
            edges: edges.filter(
                (edge) =>
                    !edgesToDelete.includes(edge) &&
                    !nodeIdsToDelete.has(edge.source) &&
                    !nodeIdsToDelete.has(edge.target)
            ),
            selectedNodeId: nodeIdsToDelete.has(selectedNodeId || '') ? null : selectedNodeId,
        });
    },
    clipboard: null,
    copyNode: () => {
        const { nodes, selectedNodeId } = get();
        const selectedNode = nodes.find((n) => n.id === selectedNodeId || n.selected);
        if (selectedNode) {
            set({ clipboard: selectedNode });
        }
    },
    pasteNode: () => {
        const { clipboard, nodes } = get();
        if (!clipboard) return;

        const id = Math.random().toString(36).substr(2, 9);
        const newNode: FlowNode = {
            ...clipboard,
            id,
            position: {
                x: clipboard.position.x + 50,
                y: clipboard.position.y + 50,
            },
            selected: true,
            data: { ...clipboard.data }, // Deep copy data if needed
        };

        set({
            nodes: [...nodes.map(n => ({ ...n, selected: false })), newNode],
            selectedNodeId: id,
        });
    },
    showEnvPanel: false,
    setShowEnvPanel: (show: boolean) => {
        set({
            showEnvPanel: show,
            // Close other panels when opening EnvPanel
            // Note: Assuming other panel states will be added or are managed elsewhere.
            // Based on requirements: setShowChatVariablePanel(false), setShowGlobalVariablePanel(false), etc.
            // For now, we just set the state.
        });
    },
    environmentVariables: [],
    setEnvironmentVariables: (vars) => set({ environmentVariables: vars }),
    envSecrets: {},
    setEnvSecrets: (secrets) => set({ envSecrets: secrets }),
}));
