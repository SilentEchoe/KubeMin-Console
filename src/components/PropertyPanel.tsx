import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { cn } from '../utils/cn';
import EnvPanel from './EnvPanel';
import ComponentSetMenu from './workflow/ComponentSetMenu';
import EnvManager from './workflow/EnvManager';
import EnvModal from './workflow/EnvModal';
import { Button } from './ui/Button';
import TraitsPanel from './TraitsPanel';
import componentIcon from '../assets/component.svg';
import configIcon from '../assets/config.svg';
import type { EnvironmentVariable } from '../types/flow';

const PANEL_CONTAINER_STYLES = 'absolute top-[70px] right-5 bottom-5 flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl z-20 transition-all duration-200';
const PANEL_TITLE_STYLES = 'text-[15px] font-semibold text-text-primary';
const PANEL_CONTENT_STYLES = 'flex-1 overflow-y-auto p-4';

export type ComponentSetSectionKey = 'system' | 'user' | 'memory' | 'vision' | 'resolution';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, updateNodeData, setSelectedNode, envSecrets, setEnvSecrets } = useFlowStore();
    const [showConfigPanel, setShowConfigPanel] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState<ComponentSetSectionKey>('system');
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [showEnvModal, setShowEnvModal] = useState(false);
    const [editingEnvVar, setEditingEnvVar] = useState<EnvironmentVariable | null>(null);
    const [showEnvList, setShowEnvList] = useState(false); // EnvManager 默认关闭

    const selectedNode = useMemo(() => {
        return nodes.find((n) => n.id === selectedNodeId);
    }, [nodes, selectedNodeId]);

    if (!selectedNode) {
        return null;
    }

    if ((selectedNode.data.componentType as any) === 'config-secret') {
        return <EnvPanel
            variables={selectedNode.data.environmentVariables || []}
            onUpdate={(vars) => updateNodeData(selectedNode.id, { environmentVariables: vars })}
        />;
    }

    const handleEnvAdd = () => {
        setEditingEnvVar(null);
        setShowEnvModal(true);
    };

    const handleEnvSave = (variable: EnvironmentVariable) => {
        if (!selectedNodeId) return;

        // Get the latest node data from store
        const latestNodes = useFlowStore.getState().nodes;
        const latestNode = latestNodes.find(n => n.id === selectedNodeId);
        if (!latestNode) return;

        const currentVars = latestNode.data.environmentVariables || [];
        let newVars: EnvironmentVariable[];

        // Store secret value separately before masking
        const secretValue = variable.isSecret ? variable.value : undefined;

        // Mask the value if it's a secret
        const variableToSave: EnvironmentVariable = variable.isSecret
            ? { ...variable, value: '[__HIDDEN__]' }
            : variable;

        if (editingEnvVar) {
            // Update existing variable
            // If key changed, remove old secret
            if (editingEnvVar.key !== variable.key && editingEnvVar.isSecret) {
                const newSecrets = { ...envSecrets };
                delete newSecrets[editingEnvVar.key];
                setEnvSecrets(newSecrets);
            }
            newVars = currentVars.map(v =>
                v.key === editingEnvVar.key ? variableToSave : v
            );
        } else {
            // Add new variable
            if (currentVars.some(v => v.key === variable.key)) {
                alert('变量名已存在');
                return;
            }
            newVars = [...currentVars, variableToSave];
        }

        // Store secret value separately
        if (variable.isSecret && secretValue) {
            setEnvSecrets({
                ...envSecrets,
                [variable.key]: secretValue
            });
        } else if (editingEnvVar && editingEnvVar.isSecret && !variable.isSecret) {
            // Remove secret if type changed from Secret
            const newSecrets = { ...envSecrets };
            delete newSecrets[variable.key];
            setEnvSecrets(newSecrets);
        }

        console.log('Saving environment variables to node:', selectedNodeId, newVars);
        updateNodeData(selectedNodeId, { environmentVariables: newVars });

        // Force a re-render by updating the state
        setTimeout(() => {
            const updatedNodes = useFlowStore.getState().nodes;
            const updatedNode = updatedNodes.find(n => n.id === selectedNodeId);
            console.log('After save, node environmentVariables:', updatedNode?.data?.environmentVariables);
        }, 100);

        setShowEnvModal(false);
        setEditingEnvVar(null);
    };

    const handleEnvEdit = (variable: EnvironmentVariable) => {
        // Get actual value from secrets if it's a secret
        const editVar: EnvironmentVariable = {
            ...variable,
            value: variable.isSecret && envSecrets[variable.key]
                ? envSecrets[variable.key]
                : variable.value
        };
        setEditingEnvVar(editVar);
        setShowEnvModal(true);
    };

    const handleEnvChange = (variables: EnvironmentVariable[]) => {
        updateNodeData(selectedNode.id, { environmentVariables: variables });
    };

    return (
        <>
            {/* Env Modal */}
            <EnvModal
                isOpen={showEnvModal}
                onClose={() => {
                    setShowEnvModal(false);
                    setEditingEnvVar(null);
                }}
                onSave={handleEnvSave}
                editingVariable={editingEnvVar}
            />

            {/* Floating Configuration Panel */}
            {showConfigPanel && (
                <div
                    className={cn(PANEL_CONTAINER_STYLES, "right-[440px]")}
                    style={{
                        minWidth: '400px',
                        maxWidth: '400px',
                        width: '400px',
                        height: 'auto',
                        maxHeight: 'calc(100vh - 100px)',
                    }}
                >
                    <div className="flex items-center justify-between border-b border-components-panel-border px-5 py-4">
                        <div className={PANEL_TITLE_STYLES}>Traits</div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfigPanel(false)}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                    <div className={PANEL_CONTENT_STYLES}>
                        <TraitsPanel node={selectedNode} />
                    </div>
                </div>
            )}

            <div className="absolute top-[70px] right-5 bottom-5 flex gap-4 z-20">
                {/* Env Sidebar - Left (conditionally rendered) */}
                {showEnvList && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '400px',
                            maxWidth: '400px',
                            width: '400px',
                            height: '100%',
                        }}
                    >
                        <div className="flex-1 overflow-y-auto p-4" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                            {selectedNode ? (
                                <EnvManager
                                    key={`${selectedNode.id}-${JSON.stringify(selectedNode.data.environmentVariables || [])}`} // Force re-render when variables change
                                    variables={(selectedNode.data.environmentVariables as EnvironmentVariable[]) || []}
                                    onChange={handleEnvChange}
                                    onAddClick={handleEnvAdd}
                                    onEditClick={handleEnvEdit}
                                    onClose={() => setShowEnvList(false)}
                                />
                            ) : (
                                <div className="text-center py-8 text-text-tertiary text-sm">请选择一个节点</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Component Properties Panel - Right */}
                <div
                    className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                    style={{
                        minWidth: '400px',
                        maxWidth: '720px',
                        width: '400px',
                        height: '100%',
                    }}
                >
                    {/* Node Name and Icon - Above tabs with 10px margin */}
                    <div className="px-5 pt-4 pb-0" style={{ marginBottom: '10px' }}>
                        <div className="flex items-center gap-2">
                            <img
                                src={(selectedNode.data.componentType as string)?.includes('config') || (selectedNode.data.componentType as string)?.includes('secret') ? configIcon : componentIcon}
                                alt="icon"
                                className="w-5 h-5"
                            />
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => {
                                        if (editingName.trim()) {
                                            updateNodeData(selectedNode.id, { name: editingName.trim() });
                                        }
                                        setIsEditingName(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (editingName.trim()) {
                                                updateNodeData(selectedNode.id, { name: editingName.trim() });
                                            }
                                            setIsEditingName(false);
                                        } else if (e.key === 'Escape') {
                                            setIsEditingName(false);
                                            setEditingName(selectedNode.data.name || '');
                                        }
                                    }}
                                    className="text-sm font-bold text-text-primary outline-none border-b-2 border-state-accent-solid bg-transparent"
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className="text-sm font-bold text-text-primary cursor-pointer"
                                    onDoubleClick={() => {
                                        setEditingName(selectedNode.data.name || '');
                                        setIsEditingName(true);
                                    }}
                                >
                                    {selectedNode.data.name || 'Unnamed'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Header with Tabs */}
                    <div className="border-b border-components-panel-border">
                        <div className="flex items-center justify-between px-5 pt-4">
                            <div className="flex items-center gap-6">
                                <button className="text-[13px] font-medium text-text-primary pb-2.5 border-b-2 border-text-primary relative">
                                    Settings
                                </button>
                                <button className="text-[13px] font-medium text-text-tertiary pb-2.5 border-b-2 border-transparent hover:text-text-secondary transition-colors">
                                    Last Run
                                </button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedNode(null)}
                                className="h-6 w-6"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={PANEL_CONTENT_STYLES}>
                        {/* Component Set 菜单栏（一比一复刻在内容顶部） */}
                        <div className="mb-4">
                            <ComponentSetMenu
                                activeKey={activeSection}
                                onChange={setActiveSection}
                                onEnvAddClick={handleEnvAdd}
                                onEnvListClick={() => setShowEnvList(true)}
                            />
                        </div>

                        {/* Placeholder for other sections */}
                        {activeSection !== 'system' && (
                            <div className="mt-6 text-xs text-text-tertiary">
                                此区域对应菜单 “{activeSection.toUpperCase()}”，后续可按需填充具体表单配置。
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default PropertyPanel;
