import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, Cpu, Box, FileText, Database, Globe, MessageSquare, Settings, Key, File, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

import { cn } from '../utils/cn';
import componentIcon from '../assets/component.svg';
import configIcon from '../assets/config.svg';
import type { ConfigDataItem, SecretDataItem, ComponentDeployStatus } from '../types/flow';
import { useFlowStore } from '../stores/flowStore';

const icons: Record<string, React.ElementType> = {
    play: Play,
    cpu: Cpu,
    output: Box,
    file: FileText,
    database: Database,
    web: Globe,
    chat: MessageSquare,
    settings: Settings,
};

const NODE_WIDTH = 'w-[240px]';
const NODE_CONTAINER_STYLES = 'rounded-[15px] bg-workflow-block-bg border-2 shadow-xs hover:shadow-lg transition-all duration-200';
const NODE_SELECTED_STYLES = '!border-components-option-card-option-selected-border ring-1 ring-components-option-card-option-selected-border';
const NODE_HEADER_STYLES = 'flex h-8 items-center justify-between rounded-lg bg-components-input-bg-normal pl-3 pr-2 mb-2';
const NODE_BODY_STYLES = 'px-3 pb-2 pt-3';
const NODE_ICON_CONTAINER_STYLES = 'flex items-center gap-2';
const NODE_BADGE_STYLES = 'flex h-[18px] items-center rounded-[5px] border border-divider-deep bg-components-badge-bg-dimm px-1 text-xs font-semibold uppercase text-text-tertiary';
const NODE_DATA_LIST_STYLES = 'mt-2 space-y-1';
const NODE_DATA_ITEM_STYLES = 'flex items-center gap-1.5 text-xs text-text-secondary truncate';

// Status-based border colors
const STATUS_BORDER_STYLES: Record<ComponentDeployStatus, string> = {
    completed: 'border-green-500',
    wait: 'border-gray-400',
    waiting: 'border-gray-400',
    running: 'border-cyan-500',
    error: 'border-red-500',
};

// Status-based background colors (subtle)
const STATUS_BG_STYLES: Record<ComponentDeployStatus, string> = {
    completed: 'bg-green-50',
    wait: 'bg-gray-50',
    waiting: 'bg-gray-50',
    running: 'bg-cyan-50',
    error: 'bg-red-50',
};

// Status icons
const StatusIcon: React.FC<{ status: ComponentDeployStatus }> = ({ status }) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 size={14} className="text-green-500" />;
        case 'wait':
        case 'waiting':
            return <Clock size={14} className="text-gray-400" />;
        case 'running':
            return <Loader2 size={14} className="text-cyan-500 animate-spin" />;
        case 'error':
            return <XCircle size={14} className="text-red-500" />;
        default:
            return null;
    }
};

const CustomNode = ({ data, selected }: NodeProps) => {
    const Icon = icons[data.icon as string] || Box;
    const isConfigSecret = (data.componentType as string) === 'config-secret';
    const originalType = data.originalType as string;
    const configData = data.configData as ConfigDataItem[] | undefined;
    const secretData = data.secretData as SecretDataItem[] | undefined;
    
    // Get component status from store
    const { componentStatuses, isPreviewMode } = useFlowStore();
    const nodeName = data.name as string;
    const componentStatus = nodeName ? componentStatuses[nodeName] : undefined;
    const deployStatus = componentStatus?.status;

    // Render config files list
    const renderConfigData = () => {
        if (!configData || configData.length === 0) return null;
        return (
            <div className={NODE_DATA_LIST_STYLES}>
                {configData.map((item) => (
                    <div key={item.id} className={NODE_DATA_ITEM_STYLES}>
                        <File size={12} className="text-text-tertiary flex-shrink-0" />
                        <span className="truncate">{item.key}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Render secret keys list
    const renderSecretData = () => {
        if (!secretData || secretData.length === 0) return null;
        return (
            <div className={NODE_DATA_LIST_STYLES}>
                {secretData.map((item) => (
                    <div key={item.id} className={NODE_DATA_ITEM_STYLES}>
                        <Key size={12} className="text-text-tertiary flex-shrink-0" />
                        <span className="truncate">{item.key}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className={cn(
                NODE_WIDTH,
                NODE_CONTAINER_STYLES,
                selected && NODE_SELECTED_STYLES,
                // Apply status-based styles when in preview mode
                isPreviewMode && deployStatus && STATUS_BORDER_STYLES[deployStatus],
                isPreviewMode && deployStatus && STATUS_BG_STYLES[deployStatus],
                // Default border when not in preview mode or no status
                !isPreviewMode && 'border-transparent'
            )}
        >
            <div className={NODE_BODY_STYLES}>
                {/* Node Name - Displayed prominently */}
                {data.name && (
                    <div className="text-sm font-bold text-text-primary mb-1 truncate flex items-center gap-1">
                        <img
                            src={isConfigSecret ? configIcon : componentIcon}
                            alt="icon"
                            className="w-5 h-5"
                        />
                        {String(data.name)}
                        {/* Status icon when in preview mode */}
                        {isPreviewMode && deployStatus && (
                            <StatusIcon status={deployStatus} />
                        )}
                    </div>
                )}

                {/* Header */}
                <div className={NODE_HEADER_STYLES}>
                    <div className={NODE_ICON_CONTAINER_STYLES}>
                        <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
                            {data.label as string}
                        </span>
                    </div>
                    <div className={NODE_BADGE_STYLES}>
                        {(data.componentType as string) === 'webservice' ? 'Web Service' :
                         (data.componentType as string) === 'store' ? 'Store' :
                         (data.componentType as string) === 'config-secret' ? (
                            originalType === 'config' ? 'Config' : 'Secret'
                         ) :
                         (data.componentType as string) === 'config' ? 'Config' :
                         (data.componentType as string) === 'secret' ? 'Secret' :
                         'Web Service'}
                    </div>
                </div>

                {/* Config/Secret Data List */}
                {isConfigSecret && originalType === 'config' && renderConfigData()}
                {isConfigSecret && originalType === 'secret' && renderSecretData()}
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!h-3 !w-3 !border-2 !border-white !bg-blue-500"
            />
        </div>
    );
};

export default memo(CustomNode);
