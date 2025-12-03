import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import type { ComponentSetSectionKey } from '../PropertyPanel';
import type { Traits } from '../../types/flow';
import { ChevronDown, Check, X } from 'lucide-react';
import { useFlowStore } from '../../stores/flowStore';
import EnvironmentVariableManager from '../EnvironmentVariableManager';
import FlexRow from '../FlexRow';
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
    onEnvAddClick?: () => void;
    onEnvListClick?: () => void;
    onTraitsEnvAddClick?: () => void;
    onTraitsStorageAddClick?: () => void;
    onTraitsSidecarAddClick?: () => void;
    onTraitsInitAddClick?: () => void;
}

const ComponentSetMenu: React.FC<ComponentSetMenuProps> = ({ activeKey: _activeKey, onChange: _onChange, onEnvAddClick, onEnvListClick, onTraitsEnvAddClick, onTraitsStorageAddClick, onTraitsSidecarAddClick, onTraitsInitAddClick }) => {
    const { nodes, selectedNodeId, updateNodeData } = useFlowStore();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const [portInput, setPortInput] = useState('');
    const [ports, setPorts] = useState<string[]>([]);
    const [isComponentTypeOpen, setIsComponentTypeOpen] = useState(false);
    const [activeEnvButton, setActiveEnvButton] = useState<'add' | 'list'>('add');


    useEffect(() => {
        if (selectedNode) {
            setPorts(selectedNode.data.ports || []);
        }
    }, [selectedNode?.id, selectedNode?.data.ports]);

    if (!selectedNode) {
        return null;
    }

    const handleAddPort = () => {
        const port = portInput.trim();
        if (port && !ports.includes(port)) {
            const newPorts = [...ports, port];
            setPorts(newPorts);
            updateNodeData(selectedNode.id, { ports: newPorts });
            setPortInput('');
        }
    };

    const handleRemovePort = (portToRemove: string) => {
        const newPorts = ports.filter(p => p !== portToRemove);
        setPorts(newPorts);
        updateNodeData(selectedNode.id, { ports: newPorts });
    };

    const handlePortKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPort();
        }
    };

    return (
        <div>
            {/* Component Type Selection */}
            <div className="mb-4 flex items-center justify-between">
                <label className="text-[13px] font-medium text-text-primary mb-0">
                    Component Type
                </label>

                <div className="relative w-[120px]">
                    <PortalToFollowElem
                        placement="bottom-end"
                        offsetValue={4}
                        trigger="click"
                        open={isComponentTypeOpen}
                        onOpenChange={setIsComponentTypeOpen}
                    >
                        <PortalToFollowElemTrigger asChild>
                            <button
                                type="button"
                                className="w-full h-[24px] px-2 flex items-center justify-between gap-2 font-normal bg-white border border-components-button-secondary-border text-text-primary hover:bg-state-base-hover text-xs rounded-md transition-colors"
                            >
                                <span className="truncate leading-none flex-1 text-left">
                                    {selectedNode.data.componentType === 'webservice' ? 'Web' :
                                        selectedNode.data.componentType === 'store' ? 'Store' :
                                            (selectedNode.data.componentType || 'Store')}
                                </span>
                                <ChevronDown className="h-3 w-3 text-text-tertiary opacity-70 shrink-0" />
                            </button>
                        </PortalToFollowElemTrigger>
                        <PortalToFollowElemContent className="w-[280px] p-1 bg-white border border-components-panel-border shadow-lg rounded-lg z-[100]">
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
                                                setIsComponentTypeOpen(false);
                                            }}
                                        >
                                            <div className={cn(
                                                "mt-0.5 flex h-4 w-4 items-center justify-center shrink-0",
                                                isSelected ? "text-state-accent-solid" : "invisible"
                                            )}>
                                                <Check size={16} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
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
                    {/* Image - Inline with label */}
                    <FlexRow className="justify-between mb-4">
                        <label className="text-[13px] font-medium text-text-primary mb-0">
                            Image <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                            type="text"
                            className={cn(INPUT_CONTAINER_STYLES, "flex-1 ml-4 h-8 outline-none focus:ring-1 focus:ring-state-accent-solid")}
                            placeholder="e.g. nginx:latest"
                            value={selectedNode.data.image || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, { image: e.target.value })}
                        />
                    </FlexRow>

                    {/* Enabled Toggle - Moved outside FieldCollapse */}
                    <FlexRow className="justify-between mb-4">
                        <label className="text-[13px] font-medium text-text-primary mb-0">TmpEnabled</label>
                        <Switch
                            checked={selectedNode.data.enabled !== false}
                            onChange={(checked) => updateNodeData(selectedNode.id, { enabled: checked })}
                            size="md"
                        />
                    </FlexRow>

                    {/* Port Tags */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center mb-2">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Ports
                            </label>
                            <div className="flex items-center gap-2 flex-1 ml-4">
                                <input
                                    type="text"
                                    className={cn(INPUT_CONTAINER_STYLES, "w-[50px] h-8 outline-none focus:ring-1 focus:ring-state-accent-solid")}
                                    placeholder="Enter port number"
                                    value={portInput}
                                    onChange={(e) => setPortInput(e.target.value)}
                                    onKeyDown={handlePortKeyDown}
                                />
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={handleAddPort}
                                    className="h-8 px-3 text-xs whitespace-nowrap"
                                >
                                    + Port
                                </Button>
                            </div>
                        </FlexRow>
                        {ports.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {ports.map((port) => (
                                    <span
                                        key={port}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-components-badge-bg-dimm text-text-primary rounded-md border border-components-panel-border"
                                    >
                                        {port}
                                        <button
                                            onClick={() => handleRemovePort(port)}
                                            className="hover:text-text-tertiary transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Replicas Slider */}
                    <FlexRow className="justify-between items-center mb-4">
                        <label className="text-[13px] font-medium text-text-primary mb-0">
                            Replicas
                        </label>
                        <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                            <div className="flex-1 relative h-8 flex items-center">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={selectedNode.data.replicas || 1}
                                    onChange={(e) => updateNodeData(selectedNode.id, { replicas: parseInt(e.target.value) || 1 })}
                                    className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                        background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((selectedNode.data.replicas || 1) - 1) / 9 * 100}%, #e5e7eb ${((selectedNode.data.replicas || 1) - 1) / 9 * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                                <style>{`
                                    .slider::-webkit-slider-thumb {
                                        appearance: none;
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 3px;
                                        background: white;
                                        cursor: pointer;
                                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
                                        border: none;
                                        margin-top: -9px;
                                    }
                                    .slider::-moz-range-thumb {
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 3px;
                                        background: white;
                                        cursor: pointer;
                                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
                                        border: none;
                                    }
                                    .slider::-webkit-slider-runnable-track {
                                        height: 1px;
                                    }
                                    .slider::-moz-range-track {
                                        height: 1px;
                                        background: transparent;
                                    }
                                `}</style>
                            </div>
                            <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                <span className="text-[13px] font-medium text-gray-700">
                                    {selectedNode.data.replicas || 1}
                                </span>
                            </div>
                        </div>
                    </FlexRow>

                    {/* Env Label and Toggle Buttons */}
                    <FlexRow className="justify-between items-center mb-4">
                        <label className="text-[13px] font-medium text-text-primary mb-0">
                            Env
                        </label>
                        <div className="flex" style={{ gap: '2px' }}>
                            {onEnvAddClick && (
                                <button
                                    onClick={() => {
                                        setActiveEnvButton('add');
                                        onEnvAddClick();
                                    }}
                                    className={cn(
                                        "flex items-center justify-center border-2 bg-white transition-colors",
                                        activeEnvButton === 'add'
                                            ? "border-[#1d4ed8] text-[#1d4ed8]"
                                            : "border-gray-300 text-gray-600"
                                    )}
                                    style={{
                                        width: '50px',
                                        height: '28px',
                                    }}
                                >
                                    <span className="text-[12px] font-medium">Add</span>
                                </button>
                            )}
                            {onEnvListClick && (
                                <button
                                    onClick={() => {
                                        setActiveEnvButton('list');
                                        onEnvListClick();
                                    }}
                                    className={cn(
                                        "flex items-center justify-center border-2 bg-white transition-colors",
                                        activeEnvButton === 'list'
                                            ? "border-[#1d4ed8] text-[#1d4ed8]"
                                            : "border-gray-300 text-gray-600"
                                    )}
                                    style={{
                                        width: '50px',
                                        height: '28px',
                                    }}
                                >
                                    <span className="text-[12px] font-medium">List</span>
                                </button>
                            )}
                        </div>
                    </FlexRow>

                    {/* Liveness Toggle */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Liveness
                            </label>
                            <Switch
                                checked={Boolean(selectedNode.data.livenessEnabled)}
                                onChange={(checked) => updateNodeData(selectedNode.id, { livenessEnabled: checked })}
                                size="md"
                            />
                        </FlexRow>

                        {/* Liveness Settings - shown when enabled */}
                        {Boolean(selectedNode.data.livenessEnabled) && (
                            <div className="mt-3 space-y-3">
                                {/* Exec Command */}
                                <div>
                                    <label className="text-[13px] font-medium text-text-primary mb-2 block">
                                        Exec Command
                                    </label>
                                    <input
                                        type="text"
                                        className={cn(INPUT_CONTAINER_STYLES, "w-full h-8 outline-none focus:ring-1 focus:ring-state-accent-solid")}
                                        placeholder='e.g. sh -c "mysqladmin ping -h127.0.0.1"'
                                        value={String(selectedNode.data.livenessExecCommand || '')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { livenessExecCommand: e.target.value })}
                                    />
                                </div>

                                {/* Initial Delay Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        initialDelaySeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="120"
                                                value={Number(selectedNode.data.livenessInitialDelay) || 30}
                                                onChange={(e) => updateNodeData(selectedNode.id, { livenessInitialDelay: parseInt(e.target.value) || 30 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${(Number(selectedNode.data.livenessInitialDelay) || 30) / 120 * 100}%, #e5e7eb ${(Number(selectedNode.data.livenessInitialDelay) || 30) / 120 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.livenessInitialDelay) || 30}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>

                                {/* Period Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        periodSeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="60"
                                                value={Number(selectedNode.data.livenessPeriod) || 10}
                                                onChange={(e) => updateNodeData(selectedNode.id, { livenessPeriod: parseInt(e.target.value) || 10 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((Number(selectedNode.data.livenessPeriod) || 10) - 1) / 59 * 100}%, #e5e7eb ${((Number(selectedNode.data.livenessPeriod) || 10) - 1) / 59 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.livenessPeriod) || 10}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>

                                {/* Timeout Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        timeoutSeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="30"
                                                value={Number(selectedNode.data.livenessTimeout) || 5}
                                                onChange={(e) => updateNodeData(selectedNode.id, { livenessTimeout: parseInt(e.target.value) || 5 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((Number(selectedNode.data.livenessTimeout) || 5) - 1) / 29 * 100}%, #e5e7eb ${((Number(selectedNode.data.livenessTimeout) || 5) - 1) / 29 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.livenessTimeout) || 5}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>
                            </div>
                        )}
                    </div>

                    {/* Readiness Toggle */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Readiness
                            </label>
                            <Switch
                                checked={Boolean(selectedNode.data.readinessEnabled)}
                                onChange={(checked) => updateNodeData(selectedNode.id, { readinessEnabled: checked })}
                                size="md"
                            />
                        </FlexRow>

                        {/* Readiness Settings - shown when enabled */}
                        {Boolean(selectedNode.data.readinessEnabled) && (
                            <div className="mt-3 space-y-3">
                                {/* Exec Command */}
                                <div>
                                    <label className="text-[13px] font-medium text-text-primary mb-2 block">
                                        Exec Command
                                    </label>
                                    <input
                                        type="text"
                                        className={cn(INPUT_CONTAINER_STYLES, "w-full h-8 outline-none focus:ring-1 focus:ring-state-accent-solid")}
                                        placeholder='e.g. sh -c "mysqladmin ping -h127.0.0.1"'
                                        value={String(selectedNode.data.readinessExecCommand || '')}
                                        onChange={(e) => updateNodeData(selectedNode.id, { readinessExecCommand: e.target.value })}
                                    />
                                </div>

                                {/* Initial Delay Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        initialDelaySeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="120"
                                                value={Number(selectedNode.data.readinessInitialDelay) || 5}
                                                onChange={(e) => updateNodeData(selectedNode.id, { readinessInitialDelay: parseInt(e.target.value) || 5 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${(Number(selectedNode.data.readinessInitialDelay) || 5) / 120 * 100}%, #e5e7eb ${(Number(selectedNode.data.readinessInitialDelay) || 5) / 120 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.readinessInitialDelay) || 5}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>

                                {/* Period Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        periodSeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="60"
                                                value={Number(selectedNode.data.readinessPeriod) || 2}
                                                onChange={(e) => updateNodeData(selectedNode.id, { readinessPeriod: parseInt(e.target.value) || 2 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((Number(selectedNode.data.readinessPeriod) || 2) - 1) / 59 * 100}%, #e5e7eb ${((Number(selectedNode.data.readinessPeriod) || 2) - 1) / 59 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.readinessPeriod) || 2}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>

                                {/* Timeout Seconds */}
                                <FlexRow className="justify-between items-center">
                                    <label className="text-[13px] font-medium text-text-primary mb-0">
                                        timeoutSeconds
                                    </label>
                                    <div className="flex items-center gap-3 flex-1 ml-4 h-8">
                                        <div className="flex-1 relative h-8 flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="30"
                                                value={Number(selectedNode.data.readinessTimeout) || 1}
                                                onChange={(e) => updateNodeData(selectedNode.id, { readinessTimeout: parseInt(e.target.value) || 1 })}
                                                className="w-full h-1 rounded-lg appearance-none cursor-pointer slider"
                                                style={{
                                                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((Number(selectedNode.data.readinessTimeout) || 1) - 1) / 29 * 100}%, #e5e7eb ${((Number(selectedNode.data.readinessTimeout) || 1) - 1) / 29 * 100}%, #e5e7eb 100%)`
                                                }}
                                            />
                                        </div>
                                        <div className="w-12 h-8 flex items-center justify-center rounded-md bg-gray-50/80 border border-components-panel-border shrink-0">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {Number(selectedNode.data.readinessTimeout) || 1}
                                            </span>
                                        </div>
                                        <span className="text-[13px] text-text-tertiary shrink-0">秒</span>
                                    </div>
                                </FlexRow>
                            </div>
                        )}
                    </div>

                    {/* Traits Env Section */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center mb-2">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Traits Env
                            </label>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onTraitsEnvAddClick}
                                className="h-8 px-3 text-xs whitespace-nowrap"
                            >
                                + Add Traits Env
                            </Button>
                        </FlexRow>
                        {((selectedNode.data.traits as Traits)?.envs || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {((selectedNode.data.traits as Traits)?.envs || []).map((env, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200"
                                    >
                                        {env.name}
                                        <span className="text-blue-400 text-[10px]">({env.valueFrom?.secret?.name})</span>
                                        <button
                                            onClick={() => {
                                                const traits = (selectedNode.data.traits as Traits) || {};
                                                updateNodeData(selectedNode.id, {
                                                    traits: { ...traits, envs: traits.envs?.filter((_, i) => i !== index) }
                                                });
                                            }}
                                            className="hover:text-blue-900 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Traits Storage Section */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center mb-2">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Traits Storage
                            </label>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onTraitsStorageAddClick}
                                className="h-8 px-3 text-xs whitespace-nowrap"
                            >
                                + Add Storage
                            </Button>
                        </FlexRow>
                        {((selectedNode.data.traits as Traits)?.storage || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {((selectedNode.data.traits as Traits)?.storage || []).map((storage, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200"
                                    >
                                        {storage.name}
                                        <span className="text-green-400 text-[10px]">({storage.type})</span>
                                        <span className="text-green-500 text-[10px]">{storage.mountPath}</span>
                                        <button
                                            onClick={() => {
                                                const traits = (selectedNode.data.traits as Traits) || {};
                                                updateNodeData(selectedNode.id, {
                                                    traits: { ...traits, storage: traits.storage?.filter((_, i) => i !== index) }
                                                });
                                            }}
                                            className="hover:text-green-900 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Traits Sidecar Section */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center mb-2">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Traits Sidecar
                            </label>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onTraitsSidecarAddClick}
                                className="h-8 px-3 text-xs whitespace-nowrap"
                            >
                                + Add Sidecar
                            </Button>
                        </FlexRow>
                        {((selectedNode.data.traits as Traits)?.sidecar || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {((selectedNode.data.traits as Traits)?.sidecar || []).map((sidecar, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-md border border-purple-200"
                                    >
                                        {sidecar.name}
                                        {sidecar.image && <span className="text-purple-400 text-[10px] max-w-[100px] truncate">({sidecar.image.split('/').pop()})</span>}
                                        <button
                                            onClick={() => {
                                                const traits = (selectedNode.data.traits as Traits) || {};
                                                updateNodeData(selectedNode.id, {
                                                    traits: { ...traits, sidecar: traits.sidecar?.filter((_, i) => i !== index) }
                                                });
                                            }}
                                            className="hover:text-purple-900 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Traits Init Section */}
                    <div className="mb-4">
                        <FlexRow className="justify-between items-center mb-2">
                            <label className="text-[13px] font-medium text-text-primary mb-0">
                                Traits Init
                            </label>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onTraitsInitAddClick}
                                className="h-8 px-3 text-xs whitespace-nowrap"
                            >
                                + Add Init
                            </Button>
                        </FlexRow>
                        {((selectedNode.data.traits as Traits)?.init || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {((selectedNode.data.traits as Traits)?.init || []).map((init, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-md border border-orange-200"
                                    >
                                        {init.name}
                                        {init.properties?.image && <span className="text-orange-400 text-[10px] max-w-[100px] truncate">({init.properties.image.split('/').pop()})</span>}
                                        <button
                                            onClick={() => {
                                                const traits = (selectedNode.data.traits as Traits) || {};
                                                updateNodeData(selectedNode.id, {
                                                    traits: { ...traits, init: traits.init?.filter((_, i) => i !== index) }
                                                });
                                            }}
                                            className="hover:text-orange-900 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

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
