import React from 'react';
import { cn } from '../../utils/cn';
import type { ComponentSetSectionKey } from '../PropertyPanel';
import { ChevronDown, Check } from 'lucide-react';
import { useFlowStore } from '../../stores/flowStore';
import EnvironmentVariableManager from '../EnvironmentVariableManager';
import FlexRow from '../FlexRow';
import DynamicInputList from '../base/DynamicInputList';
import DynamicKeyValueList from '../base/DynamicKeyValueList';
import FieldCollapse from '../base/FieldCollapse';
import { Button } from '../ui/Button';
import {
    PortalToFollowElem,
    PortalToFollowElemContent,
    PortalToFollowElemTrigger,
} from '../ui/PortalToFollowElem';
import Switch from '../base/switch';

const LABEL_STYLES = 'mb-1 block text-[13px] font-medium text-text-tertiary';
const INPUT_CONTAINER_STYLES = 'rounded-lg border border-components-panel-border bg-components-badge-bg-dimm p-2 text-[15px] hover:bg-state-base-hover transition-colors cursor-pointer';

interface ComponentSetMenuProps {
    activeKey: ComponentSetSectionKey;
    onChange: (key: ComponentSetSectionKey) => void;
}

interface ComponentSetMenuItem {
    key: ComponentSetSectionKey;
    label: string;
    count?: number;
}

const ComponentSetMenu: React.FC<ComponentSetMenuProps> = ({ activeKey, onChange }) => {
    const { nodes, selectedNodeId, updateNodeData } = useFlowStore();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }

    const menuItems: ComponentSetMenuItem[] = [
        { key: 'system', label: 'SYSTEM', count: 0 },
        { key: 'user', label: 'USER', count: 0 },
        { key: 'memory', label: '记忆', count: 32 },
        { key: 'vision', label: '视觉' },
        { key: 'resolution', label: '分辨率' },
    ];

    return (
        <div>
            {/* 模型标签 */}
            <div className="mb-2">
                <span className="text-[13px] font-medium text-text-primary">
                    模型 <span className="text-red-500">*</span>
                </span>
            </div>

            {/* 下拉选择器 */}
            <div className="mb-4">
                <div className="flex items-center justify-between px-3 py-2 bg-white border border-components-panel-border rounded-lg cursor-pointer hover:bg-state-base-hover transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8" cy="8" r="6" fill="white" />
                            </svg>
                        </div>
                        <span className="text-[13px] font-medium text-text-primary">gpt-4o-mini</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary bg-components-badge-bg-dimm rounded">CHAT</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-quaternary">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-quaternary">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-tertiary">
                        <path d="M4 8H12M8 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Component Type Selection */}
            <div className="mb-4 flex items-center justify-between">
                <label className={cn(LABEL_STYLES, "mb-0")}>
                    Component Type
                </label>


                <div className="relative w-[68px]">
                    <PortalToFollowElem placement="bottom-end" offsetValue={4}>
                        <PortalToFollowElemTrigger className="w-full">
                            <Button
                                variant="secondary"
                                size="small"
                                className="w-full justify-between items-center font-normal bg-white border-components-button-secondary-border text-text-primary hover:bg-state-base-hover px-2 h-[24px] text-xs rounded-md"
                            >
                                <span className="truncate leading-none">
                                    {selectedNode.data.componentType === 'webservice' ? 'Web' :
                                        selectedNode.data.componentType === 'store' ? 'Store' :
                                            (selectedNode.data.componentType || 'Store')}
                                </span>
                                <ChevronDown className="h-3 w-3 text-text-tertiary opacity-70 shrink-0 ml-1" />
                            </Button>
                        </PortalToFollowElemTrigger>
                        <PortalToFollowElemContent className="w-[280px] p-1 bg-white border border-components-panel-border shadow-lg rounded-lg">
                            <div className="flex flex-col gap-0.5">
                                {[
                                    {
                                        value: 'webservice',
                                        label: 'Web Service',
                                        desc: 'Standard web service component for handling requests.'
                                    },
                                    {
                                        value: 'store',
                                        label: 'Store',
                                        desc: 'Persistent storage component for data retention.'
                                    }
                                ].map((type) => {
                                    const isSelected = selectedNode.data.componentType === type.value;
                                    return (
                                        <div
                                            key={type.value}
                                            className={cn(
                                                "group flex items-start gap-2.5 p-2.5 rounded-md cursor-pointer transition-colors",
                                                isSelected ? "bg-state-accent-active" : "hover:bg-state-base-hover"
                                            )}
                                            onClick={() => {
                                                updateNodeData(selectedNode.id, { componentType: type.value as any });
                                            }}
                                        >
                                            <div className={cn(
                                                "mt-0.5 flex h-4 w-4 items-center justify-center shrink-0",
                                                isSelected ? "text-state-accent-solid" : "invisible"
                                            )}>
                                                <Check size={16} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={cn(
                                                    "text-[14px] font-medium leading-none",
                                                    isSelected ? "text-state-accent-solid" : "text-text-primary"
                                                )}>
                                                    {type.label}
                                                </span>
                                                <span className="text-[12px] leading-normal text-text-tertiary">
                                                    {type.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </PortalToFollowElemContent>
                    </PortalToFollowElem>
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

                        {/* Enabled Toggle */}
                        <FlexRow className="justify-between mb-4">
                            <label className={cn(LABEL_STYLES, "mb-0")}>Enabled</label>
                            <Switch
                                checked={selectedNode.data.enabled !== false}
                                onChange={(checked) => updateNodeData(selectedNode.id, { enabled: checked })}
                                size="md"
                            />
                        </FlexRow>

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
    );
};

export default ComponentSetMenu;
