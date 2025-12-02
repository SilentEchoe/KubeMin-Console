import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFlowStore } from '../../stores/flowStore';
import { Button } from '../ui/Button';
import {
    PortalToFollowElem,
    PortalToFollowElemContent,
    PortalToFollowElemTrigger,
} from '../ui/PortalToFollowElem';
import type { Traits, TraitEnv } from '../../types/flow';

interface TraitsEnvPanelProps {
    onClose: () => void;
    onAdd: (env: TraitEnv) => void;
}

const INPUT_STYLES = 'w-full px-3 py-2 text-sm border border-components-panel-border rounded-lg bg-white focus:ring-1 focus:ring-state-accent-solid outline-none transition-colors';

const TraitsEnvPanel: React.FC<TraitsEnvPanelProps> = ({ onClose, onAdd }) => {
    const { nodes } = useFlowStore();
    const [envName, setEnvName] = useState('');
    const [selectedNodeId, setSelectedNodeId] = useState('');
    const [envKey, setEnvKey] = useState('');
    const [isSourceOpen, setIsSourceOpen] = useState(false);

    // Filter config and secret nodes
    const configNodes = nodes.filter(n =>
        n.data.componentType === 'config' || n.data.componentType === 'secret'
    );

    const selectedSourceNode = nodes.find(n => n.id === selectedNodeId);

    const handleAdd = () => {
        if (!envName || !selectedNodeId || !envKey) return;

        const newEnv: TraitEnv = {
            name: envName,
            valueFrom: {
                secret: {
                    name: selectedSourceNode?.data.label || selectedNodeId,
                    key: envKey
                }
            }
        };

        onAdd(newEnv);

        // Reset form
        setEnvName('');
        setSelectedNodeId('');
        setEnvKey('');
    };

    const isValid = envName && selectedNodeId && envKey;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-components-panel-border">
                <span className="text-[15px] font-semibold text-text-primary">Add Traits Env</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-6 w-6"
                >
                    <X size={16} />
                </Button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Variable Name */}
                <div>
                    <label className="text-[13px] font-medium text-text-primary mb-2 block">
                        Variable Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={INPUT_STYLES}
                        placeholder="e.g. MYSQL_ROOT_PASSWORD"
                        value={envName}
                        onChange={(e) => setEnvName(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-text-tertiary">
                        The environment variable name that will be set in the container
                    </p>
                </div>

                {/* Source Node */}
                <div>
                    <label className="text-[13px] font-medium text-text-primary mb-2 block">
                        Source Node <span className="text-red-500">*</span>
                    </label>
                    <PortalToFollowElem
                        placement="bottom-start"
                        offsetValue={4}
                        trigger="click"
                        open={isSourceOpen}
                        onOpenChange={setIsSourceOpen}
                    >
                        <PortalToFollowElemTrigger asChild>
                            <button
                                type="button"
                                className={cn(INPUT_STYLES, "flex items-center justify-between cursor-pointer hover:bg-state-base-hover")}
                            >
                                <span className={cn("truncate", !selectedNodeId && "text-text-tertiary")}>
                                    {selectedSourceNode ? `${selectedSourceNode.data.label} (${selectedSourceNode.data.componentType})` : 'Select a Config/Secret node...'}
                                </span>
                                <ChevronDown className="h-4 w-4 text-text-tertiary shrink-0" />
                            </button>
                        </PortalToFollowElemTrigger>
                        <PortalToFollowElemContent className="w-[320px] p-1 bg-white border border-components-panel-border shadow-lg rounded-lg z-[100]">
                            <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
                                {configNodes.length > 0 ? (
                                    configNodes.map((node) => {
                                        const isSelected = selectedNodeId === node.id;
                                        return (
                                            <div
                                                key={node.id}
                                                className={cn(
                                                    "flex items-center gap-2.5 p-2.5 rounded-md cursor-pointer transition-colors",
                                                    isSelected ? "bg-state-accent-active" : "hover:bg-state-base-hover"
                                                )}
                                                onClick={() => {
                                                    setSelectedNodeId(node.id);
                                                    setIsSourceOpen(false);
                                                }}
                                            >
                                                <div className={cn(
                                                    "flex h-4 w-4 items-center justify-center shrink-0",
                                                    isSelected ? "text-state-accent-solid" : "invisible"
                                                )}>
                                                    <Check size={14} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                    <span className={cn(
                                                        "text-[13px] font-medium leading-none",
                                                        isSelected ? "text-state-accent-solid" : "text-text-primary"
                                                    )}>
                                                        {node.data.label}
                                                    </span>
                                                    <span className="text-[11px] leading-normal text-text-tertiary">
                                                        Type: {node.data.componentType}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-4 text-center text-sm text-text-tertiary">
                                        No Config or Secret nodes available.
                                        <br />
                                        Please add a Config or Secret node first.
                                    </div>
                                )}
                            </div>
                        </PortalToFollowElemContent>
                    </PortalToFollowElem>
                    <p className="mt-1 text-xs text-text-tertiary">
                        Select a Config or Secret node to reference the value from
                    </p>
                </div>

                {/* Key */}
                <div>
                    <label className="text-[13px] font-medium text-text-primary mb-2 block">
                        Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={INPUT_STYLES}
                        placeholder="e.g. ROOT_PASSWORD"
                        value={envKey}
                        onChange={(e) => setEnvKey(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-text-tertiary">
                        The key name in the Config/Secret to retrieve the value from
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-components-panel-border">
                <Button
                    variant="secondary"
                    size="small"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    size="small"
                    onClick={handleAdd}
                    disabled={!isValid}
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default TraitsEnvPanel;

