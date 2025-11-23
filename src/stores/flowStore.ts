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
    nodes: [
        {
            id: '1',
            type: 'custom',
            position: { x: 250, y: 5 },
            data: { label: 'Start', description: 'Entry point of the workflow', icon: 'play' },
        },
        {
            id: '2',
            type: 'custom',
            position: { x: 100, y: 200 },
            data: { label: 'Process', description: 'Data processing node', icon: 'cpu' },
        },
        {
            id: '3',
            type: 'custom',
            position: { x: 400, y: 200 },
            data: { label: 'Output', description: 'Result output', icon: 'output' },
        },
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3', animated: true },
    ],
    selectedNodeId: null,
    controlMode: ControlMode.Pointer,
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
}));
