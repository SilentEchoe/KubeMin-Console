import React, { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../stores/flowStore';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const FlowCanvas: React.FC = () => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    } = useFlowStore();

    const handleAddNode = useCallback(() => {
        const id = Math.random().toString(36).substr(2, 9);
        addNode({
            id,
            type: 'custom',
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: {
                label: 'New Node',
                description: 'Newly added node',
                icon: 'file',
            },
        });
    }, [addNode]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#f1f5f9" gap={16} />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <button
                        onClick={handleAddNode}
                        style={{
                            padding: '8px 16px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        Add Node
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
