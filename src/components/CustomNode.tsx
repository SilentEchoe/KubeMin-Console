import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, Cpu, Box, FileText, Database, Globe, MessageSquare } from 'lucide-react';

const icons: Record<string, React.ElementType> = {
    play: Play,
    cpu: Cpu,
    output: Box,
    file: FileText,
    database: Database,
    web: Globe,
    chat: MessageSquare,
};

const CustomNode = ({ data, selected }: NodeProps) => {
    const Icon = icons[data.icon as string] || Box;

    return (
        <div
            className={`custom-node ${selected ? 'selected' : ''}`}
            style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                minWidth: '240px',
                boxShadow: selected
                    ? '0 0 0 2px #2563eb, 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8fafc',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                }}
            >
                <div
                    style={{
                        background: '#eff6ff',
                        padding: '6px',
                        borderRadius: '6px',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon size={16} />
                </div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                    {data.label as string}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '12px 16px' }}>
                <div style={{ color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>
                    {data.description as string || 'No description provided.'}
                </div>
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: '#fff',
                    border: '2px solid #94a3b8',
                    width: '10px',
                    height: '10px',
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: '#fff',
                    border: '2px solid #94a3b8',
                    width: '10px',
                    height: '10px',
                }}
            />
        </div>
    );
};

export default memo(CustomNode);
