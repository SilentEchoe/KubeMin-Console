import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Key, File, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';

import { cn } from '../utils/cn';
import componentIcon from '../assets/component.svg';
import configIcon from '../assets/config.svg';
import type { ConfigDataItem, SecretDataItem, ComponentDeployStatus } from '../types/flow';
import { useFlowStore } from '../stores/flowStore';

const NODE_WIDTH = 'w-[240px]';
const NODE_CONTAINER_STYLES = 'rounded-[15px] bg-workflow-block-bg border-2 shadow-xs hover:shadow-lg transition-all duration-200';
const NODE_SELECTED_STYLES = '!border-components-option-card-option-selected-border ring-1 ring-components-option-card-option-selected-border';
const NODE_HEADER_STYLES = 'flex h-8 items-center justify-between rounded-lg bg-components-input-bg-normal pl-3 pr-2 mb-2';
const NODE_BODY_STYLES = 'px-3 pb-2 pt-3';
const NODE_ICON_CONTAINER_STYLES = 'flex items-center gap-2';
const NODE_BADGE_STYLES = 'flex h-[18px] items-center rounded-[5px] border border-divider-deep bg-components-badge-bg-dimm px-1 text-xs font-semibold uppercase text-text-tertiary';
const NODE_DATA_LIST_STYLES = 'mt-2 space-y-1';
const NODE_DATA_ITEM_STYLES = 'flex items-center gap-1.5 text-xs text-text-secondary truncate';

// Status-based border colors (using inline styles for reliability)
const STATUS_BORDER_COLORS: Record<ComponentDeployStatus, string> = {
    waiting: '#9ca3af',   // gray-400 - waiting
    queued: '#a78bfa',    // violet-400 - queued
    running: '#06b6d4',   // cyan-500 - running
    completed: '#22c55e', // green-500 - completed
    failed: '#ef4444',    // red-500 - failed
    cancelled: '#6b7280', // gray-500 - cancelled
    timeout: '#f97316',   // orange-500 - timeout
    reject: '#ec4899',    // pink-500 - reject
    prepare: '#3b82f6',   // blue-500 - prepare
};

// Status-based background colors (subtle)
const STATUS_BG_COLORS: Record<ComponentDeployStatus, string> = {
    waiting: '#f9fafb',   // gray-50
    queued: '#f5f3ff',    // violet-50
    running: '#ecfeff',   // cyan-50
    completed: '#f0fdf4', // green-50
    failed: '#fef2f2',    // red-50
    cancelled: '#f9fafb', // gray-50
    timeout: '#fff7ed',   // orange-50
    reject: '#fdf2f8',    // pink-50
    prepare: '#eff6ff',   // blue-50
};

// Status icons
const StatusIcon: React.FC<{ status: ComponentDeployStatus }> = ({ status }) => {
    switch (status) {
        case 'completed':
            return <CheckCircle2 size={14} style={{ color: '#22c55e' }} />;
        case 'waiting':
            return <Clock size={14} style={{ color: '#9ca3af' }} />;
        case 'queued':
            return <Clock size={14} style={{ color: '#a78bfa' }} />;
        case 'running':
            return <Loader2 size={14} style={{ color: '#06b6d4' }} className="animate-spin" />;
        case 'failed':
            return <XCircle size={14} style={{ color: '#ef4444' }} />;
        case 'cancelled':
            return <XCircle size={14} style={{ color: '#6b7280' }} />;
        case 'timeout':
            return <Clock size={14} style={{ color: '#f97316' }} />;
        case 'reject':
            return <XCircle size={14} style={{ color: '#ec4899' }} />;
        case 'prepare':
            return <Loader2 size={14} style={{ color: '#3b82f6' }} className="animate-spin" />;
        default:
            return null;
    }
};

const CustomNode = ({ data, selected }: NodeProps) => {
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

    // Get status-based styles
    const statusBorderColor = isPreviewMode && deployStatus ? STATUS_BORDER_COLORS[deployStatus] : undefined;
    const statusBgColor = isPreviewMode && deployStatus ? STATUS_BG_COLORS[deployStatus] : undefined;

    return (
        <div
            className={cn(
                NODE_WIDTH,
                NODE_CONTAINER_STYLES,
                selected && NODE_SELECTED_STYLES,
                // Default border when not in preview mode or no status
                !isPreviewMode && 'border-transparent'
            )}
            style={{
                ...(statusBorderColor && { borderColor: statusBorderColor }),
                ...(statusBgColor && { backgroundColor: statusBgColor }),
            }}
        >
            <div className={NODE_BODY_STYLES}>
                {/* Node Name - Displayed prominently */}
                {nodeName && (
                    <div className="text-sm font-bold text-text-primary mb-1 truncate flex items-center gap-1">
                        <img
                            src={isConfigSecret ? configIcon : componentIcon}
                            alt="icon"
                            className="w-5 h-5"
                        />
                        {nodeName}
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
