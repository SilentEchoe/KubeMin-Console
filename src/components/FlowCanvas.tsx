import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Play, ChevronDown, ListChecks, AlertCircle, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';
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
import type { FlowNode, ComponentStatus } from '../types/flow';
import type { Workflow } from '../types/app';
import PanelContextMenu from './PanelContextMenu';
import CustomEdge from './workflow/CustomEdge';
import CustomConnectionLine from './workflow/CustomConnectionLine';
import WorkflowChecklist from './workflow/WorkflowChecklist';
import type { NodeWithIssues } from './workflow/WorkflowChecklist';
import WorkflowPanel from './workflow/WorkflowPanel';
import Modal from './base/Modal';
import { applyWorkflowConnections, rearrangeNodesForWorkflow } from '../utils/workflowConnection';
import { fetchWorkflows, executeWorkflow, getTaskStatus } from '../api/apps';

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

interface FlowCanvasProps {
    appId?: string;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ appId }) => {
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
        setNodes,
        setEdges,
        isPreviewMode,
        setPreviewMode,
        taskId,
        setTaskId,
        setComponentStatuses,
        clearPreviewState,
    } = useFlowStore();

    const [viewport, setViewportState] = useState<Viewport>({ x: 0, y: 0, zoom: 1.0 });
    const [showChecklist, setShowChecklist] = useState(false);
    const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
    const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
    const [hasAppliedInitialWorkflow, setHasAppliedInitialWorkflow] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [workflowResult, setWorkflowResult] = useState<{ type: 'success' | 'error'; message: string; details?: string[] } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const reactFlowInstanceRef = useRef<any>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Handle workflow selection
    const handleSelectWorkflow = useCallback((workflow: Workflow) => {
        // Rearrange nodes based on workflow steps
        const rearrangedNodes = rearrangeNodesForWorkflow(workflow, nodes);
        setNodes(rearrangedNodes);

        // Apply workflow connections
        const newEdges = applyWorkflowConnections(workflow, rearrangedNodes);
        setEdges(newEdges);

        // Update current workflow
        setCurrentWorkflow(workflow);

        // Close the panel after applying
        setShowWorkflowPanel(false);
    }, [nodes, setNodes, setEdges]);

    // Start polling for task status
    const startPolling = useCallback((taskIdToPolling: string) => {
        // Clear any existing polling
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        const pollStatus = async () => {
            try {
                const status = await getTaskStatus(taskIdToPolling);
                
                // Update component statuses
                const statusMap: Record<string, ComponentStatus> = {};
                status.components.forEach((comp) => {
                    statusMap[comp.name] = {
                        name: comp.name,
                        type: comp.type,
                        status: comp.status,
                        startTime: comp.startTime,
                        endTime: comp.endTime,
                    };
                });
                setComponentStatuses(statusMap);

                // Terminal states that indicate the workflow has finished
                const terminalStates = ['completed', 'failed', 'cancelled', 'timeout', 'reject'];
                const errorStates = ['failed', 'cancelled', 'timeout', 'reject'];
                
                // Check if all components are in a terminal state
                const allTerminal = status.components.every(c => terminalStates.includes(c.status));
                const allCompleted = status.components.every(c => c.status === 'completed');
                const failedComponents = status.components.filter(c => errorStates.includes(c.status));

                if (allTerminal) {
                    // Stop polling
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }

                    if (allCompleted) {
                        // If all completed successfully, show success message and wait 10 seconds then exit preview mode
                        setWorkflowResult({
                            type: 'success',
                            message: 'Workflow completed successfully!',
                        });
                        setTimeout(() => {
                            clearPreviewState();
                            setWorkflowResult(null);
                        }, 10000);
                    } else if (failedComponents.length > 0) {
                        // If there are failed components, show error message and exit preview mode
                        const statusLabels: Record<string, string> = {
                            failed: 'Failed',
                            cancelled: 'Cancelled',
                            timeout: 'Timeout',
                            reject: 'Rejected',
                        };
                        const details = failedComponents.map(c => `${c.name}: ${statusLabels[c.status] || c.status}`);
                        setWorkflowResult({
                            type: 'error',
                            message: 'Workflow execution failed',
                            details,
                        });
                        // Exit preview mode after 3 seconds
                        setTimeout(() => {
                            clearPreviewState();
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Failed to poll task status:', error);
            }
        };

        // Initial poll
        pollStatus();

        // Set up interval for every 2 seconds
        pollingIntervalRef.current = setInterval(pollStatus, 2000);
    }, [setComponentStatuses, clearPreviewState]);

    // Handle publish confirmation
    const handlePublishConfirm = useCallback(async () => {
        if (!appId || !currentWorkflow) return;

        setIsPublishing(true);
        setPublishError(null);

        try {
            const response = await executeWorkflow(appId, currentWorkflow.id);
            
            // Enter preview mode
            setPreviewMode(true);
            setTaskId(response.taskId);
            
            // Close modal
            setShowPublishModal(false);
            
            // Start polling for status
            startPolling(response.taskId);
        } catch (error) {
            setPublishError(error instanceof Error ? error.message : 'Failed to execute workflow');
        } finally {
            setIsPublishing(false);
        }
    }, [appId, currentWorkflow, setPreviewMode, setTaskId, startPolling]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            clearPreviewState();
        };
    }, [clearPreviewState]);

    // Auto-apply the first (newest) workflow when nodes are loaded
    useEffect(() => {
        if (appId && nodes.length > 0 && !hasAppliedInitialWorkflow) {
            fetchWorkflows(appId).then((workflows) => {
                if (workflows.length > 0) {
                    // Sort by createTime descending (newest first)
                    const sortedWorkflows = [...workflows].sort((a, b) => {
                        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
                    });
                    
                    const firstWorkflow = sortedWorkflows[0];
                    
                    // Rearrange nodes based on workflow steps
                    const rearrangedNodes = rearrangeNodesForWorkflow(firstWorkflow, nodes);
                    setNodes(rearrangedNodes);

                    // Apply workflow connections
                    const newEdges = applyWorkflowConnections(firstWorkflow, rearrangedNodes);
                    setEdges(newEdges);

                    // Update current workflow
                    setCurrentWorkflow(firstWorkflow);
                }
                setHasAppliedInitialWorkflow(true);
            });
        }
    }, [appId, nodes.length, hasAppliedInitialWorkflow, setNodes, setEdges]);

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
                onNodesChange={isPreviewMode ? undefined : onNodesChange}
                onEdgesChange={isPreviewMode ? undefined : onEdgesChange}
                onConnect={isPreviewMode ? undefined : onConnect}
                onNodeClick={isPreviewMode ? undefined : onNodeClick}
                onPaneClick={onPaneClick}
                onPaneContextMenu={isPreviewMode ? undefined : handlePaneContextMenu}
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
                selectionOnDrag={isPreviewMode ? false : controlMode === ControlMode.Pointer}
                panOnScrollMode={PanOnScrollMode.Free} // Free pan on scroll
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                zoomOnScroll={false} // Disabled to use custom 1% zoom step
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                nodesDraggable={!isPreviewMode}
                nodesConnectable={!isPreviewMode}
                elementsSelectable={!isPreviewMode}
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
                                onClick={() => setShowWorkflowPanel(!showWorkflowPanel)}
                                className={`flex h-7 cursor-pointer items-center rounded-md px-2.5 text-[13px] font-medium hover:bg-state-base-hover border-none bg-transparent ${showWorkflowPanel ? 'text-blue-600 bg-blue-50' : 'text-text-secondary'}`}
                            >
                                Workflow
                            </button>
                        </div>

                        {/* Workflow Button */}
                        <div className="relative flex h-8 items-center">
                            <button
                                onClick={() => setShowChecklist(!showChecklist)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg text-text-secondary hover:bg-state-base-hover cursor-pointer"
                            >
                                <ListChecks className="h-4 w-4" />
                            </button>
                            {workflowIssues.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                                    {workflowIssues.reduce((sum, n) => sum + n.issues.length, 0)}
                                </span>
                            )}
                        </div>

                        {/* Publish Button */}
                        <div className="flex h-8 items-center">
                            <button
                                onClick={() => setShowPublishModal(true)}
                                disabled={isPreviewMode}
                                className={`flex h-8 items-center rounded-lg px-3 text-[13px] font-medium border-none ${
                                    isPreviewMode 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-components-button-primary-bg text-components-button-primary-text hover:bg-components-button-primary-hover cursor-pointer'
                                }`}
                            >
                                Publish
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                        </div>

                        {/* Exit Preview Mode Button */}
                        {isPreviewMode && (
                            <div className="flex h-8 items-center">
                                <button
                                    onClick={() => clearPreviewState()}
                                    className="flex h-8 items-center rounded-lg bg-gray-600 px-3 text-[13px] font-medium text-white hover:bg-gray-700 border-none cursor-pointer"
                                >
                                    Exit Preview
                                </button>
                            </div>
                        )}
                    </div>
                </Panel>
                
                {/* Workflow Checklist Panel */}
                <WorkflowChecklist
                    isOpen={showChecklist}
                    onClose={() => setShowChecklist(false)}
                    nodes={workflowIssues}
                />
                
                {/* Workflow Selection Panel */}
                {appId && (
                    <WorkflowPanel
                        isOpen={showWorkflowPanel}
                        onClose={() => setShowWorkflowPanel(false)}
                        appId={appId}
                        onSelectWorkflow={handleSelectWorkflow}
                        selectedWorkflowId={currentWorkflow?.id}
                    />
                )}
                <ZoomIndicator />
            </ReactFlow>

            {/* Publish Confirmation Modal */}
            <Modal
                isShow={showPublishModal}
                onClose={() => {
                    setShowPublishModal(false);
                    setPublishError(null);
                }}
                title="Publish Workflow"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to publish this workflow?
                    </p>
                    
                    {currentWorkflow ? (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                    <Play size={14} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {currentWorkflow.alias || currentWorkflow.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {currentWorkflow.steps.length} steps
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2 text-yellow-700">
                                <AlertCircle size={16} />
                                <span className="text-sm">No workflow selected. Please select a workflow first.</span>
                            </div>
                        </div>
                    )}

                    {publishError && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 text-red-700">
                                <AlertCircle size={16} />
                                <span className="text-sm">{publishError}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => {
                                setShowPublishModal(false);
                                setPublishError(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePublishConfirm}
                            disabled={!currentWorkflow || isPublishing}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 ${
                                !currentWorkflow || isPublishing
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                            }`}
                        >
                            {isPublishing && <Loader2 size={14} className="animate-spin" />}
                            {isPublishing ? 'Publishing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Workflow Result Toast */}
            {workflowResult && (
                <div 
                    className={`fixed top-20 right-6 z-[100] max-w-sm rounded-lg shadow-lg border p-4 animate-in slide-in-from-right ${
                        workflowResult.type === 'success' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        {workflowResult.type === 'success' ? (
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                                workflowResult.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {workflowResult.message}
                            </p>
                            {workflowResult.details && workflowResult.details.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {workflowResult.details.map((detail, index) => (
                                        <li key={index} className="text-xs text-red-600">
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {workflowResult.type === 'success' && (
                                <p className="mt-1 text-xs text-green-600">
                                    Exiting preview mode in 10 seconds...
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setWorkflowResult(null);
                                if (workflowResult.type === 'error') {
                                    clearPreviewState();
                                }
                            }}
                            className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
                        >
                            <X size={14} className={workflowResult.type === 'success' ? 'text-green-500' : 'text-red-500'} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlowCanvas;
