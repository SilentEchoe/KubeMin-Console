import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { cn } from '../utils/cn';
import EnvironmentVariableManager from './EnvironmentVariableManager';

import EnvPanel from './EnvPanel';
import FlexRow from './FlexRow';
// import DropdownButton from './ui/DropdownButton';
import DynamicInputList from './base/DynamicInputList';
import DynamicKeyValueList from './base/DynamicKeyValueList';
import FieldCollapse from './base/FieldCollapse';

import { Settings } from 'lucide-react';
import { Button } from './ui/Button';
import TraitsPanel from './TraitsPanel';

const PANEL_CONTAINER_STYLES = 'absolute top-[70px] right-5 bottom-5 flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl z-20 transition-all duration-200';
const PANEL_HEADER_STYLES = 'flex items-center justify-between border-b border-components-panel-border px-5 py-4';
const PANEL_TITLE_STYLES = 'text-[15px] font-semibold text-text-primary';
const PANEL_CLOSE_BUTTON_STYLES = 'flex items-center justify-center rounded-md p-1 text-text-secondary hover:bg-state-base-hover transition-colors';
const PANEL_CONTENT_STYLES = 'flex-1 overflow-y-auto p-4';
const LABEL_STYLES = 'mb-1 block text-[12px] font-medium text-text-tertiary uppercase';
const INPUT_CONTAINER_STYLES = 'rounded-lg border border-components-panel-border bg-components-badge-bg-dimm p-2 text-[15px] hover:bg-state-base-hover transition-colors cursor-pointer';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, setSelectedNode, updateNodeData } = useFlowStore();
    const [showConfigPanel, setShowConfigPanel] = React.useState(false);

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }

    if ((selectedNode.data.componentType as any) === 'config-secret') {
        return <EnvPanel />;
    }

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
                    <div className={PANEL_HEADER_STYLES}>
                        <div className={PANEL_TITLE_STYLES}>Traits</div>
                        <button
                            onClick={() => setShowConfigPanel(false)}
                            className={PANEL_CLOSE_BUTTON_STYLES}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className={PANEL_CONTENT_STYLES}>
                        <TraitsPanel node={selectedNode} />
                    </div>
                </div>
            )}

            <div
                className={PANEL_CONTAINER_STYLES}
                style={{
                    minWidth: '400px',
                    maxWidth: '720px',
                    width: '400px', // Default width, could be dynamic
                }}
            >
                {/* Header */}
                <div className={PANEL_HEADER_STYLES}>
                    <div className={PANEL_TITLE_STYLES}>
                        Component Set
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="medium"
                            className="btn disabled:btn-disabled btn-primary btn-medium"
                            onClick={() => setShowConfigPanel(!showConfigPanel)}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Add Traits
                        </Button>
                        <button
                            onClick={() => setSelectedNode(null)}
                            className={PANEL_CLOSE_BUTTON_STYLES}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={PANEL_CONTENT_STYLES}>
                    {/* Component Type Selection */}
                    <div className="mb-4 flex items-center justify-between">
                        <label className={cn(LABEL_STYLES, "mb-0")}>
                            Component Type
                        </label>
                        <div className="relative w-[180px]">
                            <select
                                className={cn(INPUT_CONTAINER_STYLES, "w-full appearance-none flex items-center justify-between outline-none focus:ring-1 focus:ring-state-accent-solid")}
                                value={selectedNode.data.componentType || 'webservice'}
                                onChange={(e) => {
                                    updateNodeData(selectedNode.id, { componentType: e.target.value as any });
                                }}
                            >
                                <option value="webservice">webservice</option>
                                <option value="store">store</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none" />
                        </div>
                    </div>

                    {/* Conditional Controls */}
                    {(!selectedNode.data.componentType || selectedNode.data.componentType === 'webservice') && (
                        <>
                            {/* Image - Moved to second row */}
                            <div className="mb-4">
                                <label className={LABEL_STYLES}>
                                    Image <span className="text-red-500 ml-0.5">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={cn(INPUT_CONTAINER_STYLES, "w-full outline-none focus:ring-1 focus:ring-state-accent-solid")}
                                    placeholder="e.g. nginx:latest"
                                    value={selectedNode.data.image || ''}
                                    onChange={(e) => updateNodeData(selectedNode.id, { image: e.target.value })}
                                />
                            </div>

                            <FieldCollapse title="Basic Settings" defaultOpen={true}>
                                {/* Namespace Removed */}

                                {/* Replicas */}
                                <FlexRow className="justify-between">
                                    <label className={cn(LABEL_STYLES, "mb-0")}>Replicas</label>
                                    <input
                                        type="number"
                                        className={cn(INPUT_CONTAINER_STYLES, "w-24 outline-none focus:ring-1 focus:ring-state-accent-solid text-right")}
                                        placeholder="1"
                                        min={1}
                                        value={selectedNode.data.replicas || 1}
                                        onChange={(e) => updateNodeData(selectedNode.id, { replicas: parseInt(e.target.value) || 1 })}
                                    />
                                </FlexRow>
                            </FieldCollapse>

                            <FieldCollapse title="Properties" defaultOpen={true}>
                                {/* Tags (Dynamic Input List) */}
                                <div>
                                    <DynamicInputList
                                        key={selectedNode.id} // Force re-render on node change
                                        title="" // Title handled by FieldCollapse
                                        placeholder="Enter port"
                                        btnText="Add Properties"
                                        inputType="number"
                                        inputClassName="bg-white focus:bg-gray-50 text-[12px]"
                                        deleteBtnClassName="bg-white h-6 w-6 p-1"
                                        showEmptyState={false}
                                        itemContainerClassName="bg-white"
                                        initialItems={selectedNode.data.properties || []}
                                        onItemsChange={(items) => updateNodeData(selectedNode.id, { properties: items })}
                                    />
                                </div>
                            </FieldCollapse>

                            <FieldCollapse title="ENV" defaultOpen={true}>
                                {/* Config (Dynamic Key-Value List) */}
                                <div>
                                    <DynamicKeyValueList
                                        key={selectedNode.id} // Force re-render on node change
                                        title="" // Title handled by FieldCollapse
                                        keyPlaceholder="Name"
                                        valuePlaceholder="Value"
                                        btnText="Add Config"
                                        inputClassName="bg-white focus:bg-gray-50 text-[12px]"
                                        deleteBtnClassName="bg-white h-6 w-6 p-1"
                                        showEmptyState={false}
                                        itemContainerClassName="bg-white"
                                        initialItems={selectedNode.data.envConfig || []}
                                        onItemsChange={(items) => updateNodeData(selectedNode.id, { envConfig: items })}
                                    />
                                </div>
                            </FieldCollapse>
                        </>
                    )}

                    {(selectedNode.data.componentType === 'config' || selectedNode.data.componentType === 'secret') && (
                        <div className="mb-4">
                            <label className={LABEL_STYLES}>
                                {selectedNode.data.componentType === 'secret' ? 'Secret Variables' : '环境变量'}
                            </label>
                            <EnvironmentVariableManager
                                variables={selectedNode.data.environmentVariables || []}
                                onChange={(variables) => updateNodeData(selectedNode.id, { environmentVariables: variables })}
                            />
                        </div>
                    )}


                </div>
            </div>

        </>
    );
};

export default PropertyPanel;
