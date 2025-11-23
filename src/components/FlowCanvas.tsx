import React, { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    useViewport,
    BackgroundVariant,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../stores/flowStore';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const ZoomIndicator = () => {
    const { zoom } = useViewport();
    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#64748b',
            pointerEvents: 'none',
            zIndex: 5
        }}>
            {Math.round(zoom * 100)}%
        </div>
    );
};

const FlowCanvas: React.FC = () => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setSelectedNode,
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

    const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
        setSelectedNode(node.id);
    }, [setSelectedNode]);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
                fitView={false}
            >
                <Background color="#94a3b8" gap={20} size={1} variant={BackgroundVariant.Dots} />
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
                <ZoomIndicator />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
