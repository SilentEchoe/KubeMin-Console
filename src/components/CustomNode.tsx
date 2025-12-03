import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, Cpu, Box, FileText, Database, Globe, MessageSquare, Settings } from 'lucide-react';

import { cn } from '../utils/cn';
import componentIcon from '../assets/component.svg';
import configIcon from '../assets/config.svg';

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
const NODE_CONTAINER_STYLES = 'rounded-[15px] bg-workflow-block-bg border border-transparent shadow-xs hover:shadow-lg transition-all duration-200';
const NODE_SELECTED_STYLES = '!border-components-option-card-option-selected-border ring-1 ring-components-option-card-option-selected-border';
const NODE_HEADER_STYLES = 'flex h-8 items-center justify-between rounded-lg bg-components-input-bg-normal pl-3 pr-2 mb-2';
const NODE_BODY_STYLES = 'px-3 pb-2 pt-3';
const NODE_ICON_CONTAINER_STYLES = 'flex items-center gap-2';
const NODE_BADGE_STYLES = 'flex h-[18px] items-center rounded-[5px] border border-divider-deep bg-components-badge-bg-dimm px-1 text-xs font-semibold uppercase text-text-tertiary';

const CustomNode = ({ data, selected }: NodeProps) => {
    const Icon = icons[data.icon as string] || Box;

    return (
        <div
            className={cn(
                NODE_WIDTH,
                NODE_CONTAINER_STYLES,
                selected && NODE_SELECTED_STYLES
            )}
        >
            <div className={NODE_BODY_STYLES}>
                {/* Node Name - Displayed prominently */}
                {data.name && (
                    <div className="text-sm font-bold text-text-primary mb-1 truncate flex items-center gap-1">
                        <img
                            src={(data.componentType as string)?.includes('config') || (data.componentType as string)?.includes('secret') ? configIcon : componentIcon}
                            alt="icon"
                            className="w-5 h-5"
                        />
                        {String(data.name)}
                    </div>
                )}

                {/* Header */}
                <div className={NODE_HEADER_STYLES}>
                    <div className={NODE_ICON_CONTAINER_STYLES}>
                        {/* <Icon size={14} className="text-text-primary" /> */}
                        <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
                            {data.label as string}
                        </span>
                    </div>
                    <div className={NODE_BADGE_STYLES}>
                        {(data.componentType as string) === 'webservice' ? 'Web Service' :
                         (data.componentType as string) === 'store' ? 'Store' :
                         (data.componentType as string)?.includes('config') ? 'Config' :
                         (data.componentType as string)?.includes('secret') ? 'Secret' :
                         'Web Service'}
                    </div>
                </div>


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
