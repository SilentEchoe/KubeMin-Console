import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Play, ChevronDown, ListChecks } from 'lucide-react';
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

// Viewport type definition
type Viewport = { x: number; y: number; zoom: number };

import { useFlowStore } from '../stores/flowStore';
import CustomNode from './CustomNode';
import CanvasControl from './CanvasControl';
import { ControlMode } from '../types/flow';
import type { FlowNode } from '../types/flow';
import PanelContextMenu from './PanelContextMenu';
import CustomEdge from './workflow/CustomEdge';
import CustomConnectionLine from './workflow/CustomConnectionLine';
import WorkflowChecklist from './workflow/WorkflowChecklist';
import type { NodeWithIssues } from './workflow/WorkflowChecklist';

import { useShortcuts } from '../hooks/useShortcuts';

// Zoom configuration constants
const MIN_ZOOM = 0.1;  // 10%
const MAX_ZOOM = 2.0;  // 200%
const ZOOM_STEP = 0.01; // 1% per scroll

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

const defaultEdgeOptions = {
    type: 'custom',
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
    useShortcuts();
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

    const [viewport, setViewportState] = useState<Viewport>({ x: 0, y: 0, zoom: 1.0 });
    const [showChecklist, setShowChecklist] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const reactFlowInstanceRef = useRef<any>(null);

    // Generate workflow issues from nodes
    const getWorkflowIssues = useCallback((): NodeWithIssues[] => {
        const issues: NodeWithIssues[] = [];
        
        nodes.forEach((node) => {
            const nodeIssues: { message: string }[] = [];
            
            // Check if node has connections
            const hasIncoming = edges.some(e => e.target === node.id);
            const hasOutgoing = edges.some(e => e.source === node.id);
            
            if (!hasIncoming && !hasOutgoing) {
                nodeIssues.push({ message: '此节点尚未连接到其他节点' });
            }
            
            // Check required fields based on node type
            if (node.data.componentType === 'webservice' || node.data.componentType === 'store') {
                if (!node.data.image) {
                    nodeIssues.push({ message: '镜像 不能为空' });
                }
            }
            
            // Check if name is empty
            if (!node.data.name) {
                nodeIssues.push({ message: '名称 不能为空' });
            }
            
            if (nodeIssues.length > 0) {
                issues.push({
                    id: node.id,
                    name: node.data.name || node.data.label || '未命名节点',
                    type: node.data.componentType === 'config-secret' ? 'list' : 'reply',
                    issues: nodeIssues,
                });
            }
        });
        
        return issues;
    }, [nodes, edges]);

    const workflowIssues = getWorkflowIssues();

    // Track viewport changes
    const onMove = useCallback((_: any, viewport: Viewport) => {
        setViewportState(viewport);
    }, []);

    // Custom wheel handler for 1% zoom step
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (event: WheelEvent) => {
            // Check if it's a zoom gesture (Ctrl/Cmd + scroll)
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                
                if (!reactFlowInstanceRef.current) return;
                
                const { x, y, zoom } = viewport;
                const rect = container.getBoundingClientRect();
                
                // Calculate mouse position relative to the container
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                
                // Determine zoom direction
                const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
                const newZoom = Math.min(Math.max(zoom + delta, MIN_ZOOM), MAX_ZOOM);
                
                // Calculate new viewport position to zoom towards mouse position
                const scale = newZoom / zoom;
                const newX = mouseX - (mouseX - x) * scale;
                const newY = mouseY - (mouseY - y) * scale;
                
                reactFlowInstanceRef.current.setViewport({ x: newX, y: newY, zoom: newZoom }, { duration: 0 });
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [viewport]);

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
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onPaneContextMenu={handlePaneContextMenu}
                onMove={onMove}
                onInit={(instance) => {
                    reactFlowInstanceRef.current = instance;
                }}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineComponent={CustomConnectionLine}
                defaultViewport={{ x: 0, y: 0, zoom: 1.0 }} // Default to 100%
                fitView={false}
                deleteKeyCode={null} // Disable default delete to use custom shortcuts
                panOnScroll={controlMode === ControlMode.Pointer}
                panOnDrag={controlMode === ControlMode.Hand || [1, 2]}
                selectionOnDrag={controlMode === ControlMode.Pointer}
                panOnScrollMode={PanOnScrollMode.Free} // Free pan on scroll
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                zoomOnScroll={false} // Disabled to use custom 1% zoom step
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
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

                        {/* Workflow Button */}
                        <div className="relative flex h-8 items-center">
                            <button
                                onClick={() => setShowChecklist(!showChecklist)}
                                className="flex h-8 items-center rounded-lg border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg px-3 text-[13px] font-medium text-text-secondary hover:bg-state-base-hover cursor-pointer"
                            >
                                <ListChecks className="mr-1.5 h-4 w-4" />
                                Workflow
                                {workflowIssues.length > 0 && (
                                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white">
                                        {workflowIssues.reduce((sum, n) => sum + n.issues.length, 0)}
                                    </span>
                                )}
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
                
                {/* Workflow Checklist Panel */}
                <WorkflowChecklist
                    isOpen={showChecklist}
                    onClose={() => setShowChecklist(false)}
                    nodes={workflowIssues}
                />
                <ZoomIndicator />
            </ReactFlow>
        </div>
    );
};

export default FlowCanvas;
