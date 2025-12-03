import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { cn } from '../utils/cn';
import ConfigSecretPanel from './ConfigSecretPanel';
import ComponentSetMenu from './workflow/ComponentSetMenu';
import WorkflowEnvPanel from './workflow/EnvPanel';
import TraitsEnvPanel from './workflow/TraitsEnvPanel';
import TraitsStoragePanel from './workflow/TraitsStoragePanel';
import TraitsSidecarPanel from './workflow/TraitsSidecarPanel';
import TraitsInitPanel from './workflow/TraitsInitPanel';
import { Button } from './ui/Button';
import TraitsPanel from './TraitsPanel';
import componentIcon from '../assets/component.svg';
import configIcon from '../assets/config.svg';
import type { EnvironmentVariable, Traits, TraitEnv, TraitStorage, TraitContainer } from '../types/flow';

type TraitsPanelType = 'env' | 'storage' | 'sidecar' | 'init' | null;

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
    const [showEnvPanel, setShowEnvPanel] = useState(false); // Env Panel 侧边栏
    const [activeTraitsPanel, setActiveTraitsPanel] = useState<TraitsPanelType>(null); // Current active traits panel

    const selectedNode = useMemo(() => {
        return nodes.find((n) => n.id === selectedNodeId);
    }, [nodes, selectedNodeId]);

    if (!selectedNode) {
        return null;
    }

    // Use ConfigSecretPanel for config-secret type nodes
    if ((selectedNode.data.componentType as any) === 'config-secret') {
        return <ConfigSecretPanel />;
    }

    const handleEnvAdd = () => {
        setShowEnvPanel(true);
    };

    const handleEnvAddFromPanel = (variable: EnvironmentVariable) => {
        if (!selectedNodeId) return;

        // Get the latest node data from store
        const latestNodes = useFlowStore.getState().nodes;
        const latestNode = latestNodes.find(n => n.id === selectedNodeId);
        if (!latestNode) return;

        const currentVars = latestNode.data.environmentVariables || [];

        // Check for duplicate key
        if (currentVars.some(v => v.key === variable.key)) {
            alert('变量名已存在');
            return;
        }

        // Store secret value separately before masking
        const secretValue = variable.isSecret ? variable.value : undefined;

        // Mask the value if it's a secret
        const variableToSave: EnvironmentVariable = variable.isSecret
            ? { ...variable, value: '[__HIDDEN__]' }
            : variable;

        const newVars = [...currentVars, variableToSave];

        // Store secret value separately
        if (variable.isSecret && secretValue) {
            setEnvSecrets({
                ...envSecrets,
                [variable.key]: secretValue
            });
        }

        updateNodeData(selectedNodeId, { environmentVariables: newVars });
        setShowEnvPanel(false);
    };

    const handleTraitsEnvAdd = (newEnv: TraitEnv) => {
        if (!selectedNode) return;
        const traits = (selectedNode.data.traits as Traits) || {};
        updateNodeData(selectedNode.id, {
            traits: { ...traits, envs: [...(traits.envs || []), newEnv] }
        });
        setActiveTraitsPanel(null);
    };

    const handleTraitsStorageAdd = (newStorage: TraitStorage) => {
        if (!selectedNode) return;
        const traits = (selectedNode.data.traits as Traits) || {};
        updateNodeData(selectedNode.id, {
            traits: { ...traits, storage: [...(traits.storage || []), newStorage] }
        });
        setActiveTraitsPanel(null);
    };

    const handleTraitsSidecarAdd = (newSidecar: TraitContainer) => {
        if (!selectedNode) return;
        const traits = (selectedNode.data.traits as Traits) || {};
        updateNodeData(selectedNode.id, {
            traits: { ...traits, sidecar: [...(traits.sidecar || []), newSidecar] }
        });
        setActiveTraitsPanel(null);
    };

    const handleTraitsInitAdd = (newInit: TraitContainer) => {
        if (!selectedNode) return;
        const traits = (selectedNode.data.traits as Traits) || {};
        updateNodeData(selectedNode.id, {
            traits: { ...traits, init: [...(traits.init || []), newInit] }
        });
        setActiveTraitsPanel(null);
    };

    return (
        <>
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
                {/* Traits Panels - Left (conditionally rendered) */}
                {activeTraitsPanel === 'env' && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '360px',
                            maxWidth: '360px',
                            width: '360px',
                            height: '100%',
                        }}
                    >
                        <TraitsEnvPanel
                            onClose={() => setActiveTraitsPanel(null)}
                            onAdd={handleTraitsEnvAdd}
                        />
                    </div>
                )}

                {activeTraitsPanel === 'storage' && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '360px',
                            maxWidth: '360px',
                            width: '360px',
                            height: '100%',
                        }}
                    >
                        <TraitsStoragePanel
                            onClose={() => setActiveTraitsPanel(null)}
                            onAdd={handleTraitsStorageAdd}
                        />
                    </div>
                )}

                {activeTraitsPanel === 'sidecar' && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '400px',
                            maxWidth: '400px',
                            width: '400px',
                            height: '100%',
                        }}
                    >
                        <TraitsSidecarPanel
                            onClose={() => setActiveTraitsPanel(null)}
                            onAdd={handleTraitsSidecarAdd}
                        />
                    </div>
                )}

                {activeTraitsPanel === 'init' && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '400px',
                            maxWidth: '400px',
                            width: '400px',
                            height: '100%',
                        }}
                    >
                        <TraitsInitPanel
                            onClose={() => setActiveTraitsPanel(null)}
                            onAdd={handleTraitsInitAdd}
                        />
                    </div>
                )}

                {/* Env Panel - Left (conditionally rendered) */}
                {showEnvPanel && !activeTraitsPanel && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl transition-all duration-200"
                        style={{
                            minWidth: '360px',
                            maxWidth: '360px',
                            width: '360px',
                            height: '100%',
                        }}
                    >
                        <WorkflowEnvPanel
                            onClose={() => setShowEnvPanel(false)}
                            onAdd={handleEnvAddFromPanel}
                        />
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
                        <div className="flex items-center justify-between gap-2">
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
                                        className="text-sm font-bold text-text-primary outline-none border-b-2 border-blue-300 bg-transparent"
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

                    {/* Header with Tabs */}
                    <div className="border-b border-components-panel-border">
                        <div className="flex items-center gap-6 px-5 pt-4">
                            <button className="text-[13px] font-medium text-text-primary pb-2.5 border-b-2 border-text-primary relative">
                                Settings
                            </button>
                            <button className="text-[13px] font-medium text-text-tertiary pb-2.5 border-b-2 border-transparent hover:text-text-secondary transition-colors">
                                Last Run
                            </button>
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
                                onTraitsEnvAddClick={() => setActiveTraitsPanel('env')}
                                onTraitsStorageAddClick={() => setActiveTraitsPanel('storage')}
                                onTraitsSidecarAddClick={() => setActiveTraitsPanel('sidecar')}
                                onTraitsInitAddClick={() => setActiveTraitsPanel('init')}
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
