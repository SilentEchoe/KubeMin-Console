import React, { useCallback } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    useViewport,
    BackgroundVariant,
    PanOnScrollMode,
} from '@xyflow/react';
import type { NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../stores/flowStore';
import CustomNode from './CustomNode';
import CanvasControl from './CanvasControl';
import { ControlMode } from '../types/flow';
import type { FlowNode } from '../types/flow';
import PanelContextMenu from './PanelContextMenu';

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
        setSelectedNode,
        controlMode,
        setPanelMenu,
    } = useFlowStore();

    const handlePaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault();
        const container = document.querySelector('.react-flow');
        if (container) {
            const { left, top } = container.getBoundingClientRect();
            setPanelMenu({
                top: event.clientY - top,
                left: event.clientX - left,
            });
        }
    }, [setPanelMenu]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: FlowNode) => {
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
                onPaneContextMenu={handlePaneContextMenu}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
                fitView={false}
                panOnScroll={controlMode === ControlMode.Pointer}
                panOnDrag={controlMode === ControlMode.Hand || [1, 2]}
                selectionOnDrag={controlMode === ControlMode.Pointer}
                panOnScrollMode={PanOnScrollMode.Free} // Free pan on scroll
            >
                <Background color="#94a3b8" gap={20} size={1} variant={BackgroundVariant.Dots} />
                <Controls />
                <MiniMap />
                <CanvasControl />
                <PanelContextMenu />
                <Panel position="top-right">
                    <div className="flex items-center gap-2">
                        {/* Test Run Button Group */}
                        <div className="flex h-8 items-center rounded-lg border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg px-0.5 shadow-xs">
                            <button
                                onClick={() => console.log('Test Run')}
                                className="flex h-7 cursor-pointer items-center rounded-md px-2.5 text-[13px] font-medium text-text-secondary hover:bg-state-base-hover border-none bg-transparent"
                            >
                                <Play className="mr-1 h-4 w-4" />
                                Test Run
                            </button>
                            <div className="mx-0.5 h-3.5 w-[1px] bg-divider-regular"></div>
                            <button
                                className="flex h-7 cursor-pointer items-center rounded-md px-2.5 text-[13px] font-medium text-text-secondary hover:bg-state-base-hover border-none bg-transparent"
                            >
                                History
                            </button>
                        </div>

                        {/* Publish Button */}
                        <div className="flex h-8 items-center">
                            <button
                                onClick={() => console.log('Publish')}
                                className="flex h-8 items-center rounded-lg bg-components-button-primary-bg px-3 text-[13px] font-medium text-components-button-primary-text hover:bg-components-button-primary-hover border-none cursor-pointer"
                            >
                                Publish
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </Panel>
                <ZoomIndicator />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
