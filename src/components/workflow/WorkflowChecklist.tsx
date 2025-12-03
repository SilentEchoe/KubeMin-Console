import React from 'react';
import { X, AlertTriangle, MessageSquare, List } from 'lucide-react';

// Node issue types
export interface NodeIssue {
    message: string;
}

export interface NodeWithIssues {
    id: string;
    name: string;
    type: 'reply' | 'list' | 'other';
    issues: NodeIssue[];
}

interface WorkflowChecklistProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: NodeWithIssues[];
}

// Icon component for node type
const NodeIcon: React.FC<{ type: NodeWithIssues['type'] }> = ({ type }) => {
    const iconConfig = {
        reply: {
            bgColor: '#FFF7ED',
            borderColor: '#FB923C',
            iconColor: '#F97316',
            Icon: MessageSquare,
        },
        list: {
            bgColor: '#EFF6FF',
            borderColor: '#60A5FA',
            iconColor: '#3B82F6',
            Icon: List,
        },
        other: {
            bgColor: '#F3F4F6',
            borderColor: '#9CA3AF',
            iconColor: '#6B7280',
            Icon: MessageSquare,
        },
    };

    const config = iconConfig[type] || iconConfig.other;
    const { Icon, bgColor, borderColor, iconColor } = config;

    return (
        <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
            }}
        >
            <Icon size={16} color={iconColor} />
        </div>
    );
};

const WorkflowChecklist: React.FC<WorkflowChecklistProps> = ({
    isOpen,
    onClose,
    nodes,
}) => {
    if (!isOpen) return null;

    // Calculate total issues count
    const totalIssues = nodes.reduce((sum, node) => sum + node.issues.length, 0);

    return (
        <div
            className="absolute right-4 top-16 z-50 w-[400px] rounded-2xl bg-white shadow-xl"
            style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        检查清单({totalIssues})
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    发布前确保所有问题均已解决
                </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto">
                {nodes.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                        没有发现问题
                    </div>
                ) : (
                    nodes.map((node) => (
                        <div
                            key={node.id}
                            className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                        >
                            {/* Node Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <NodeIcon type={node.type} />
                                <span className="font-medium text-gray-900">
                                    {node.name}
                                </span>
                            </div>

                            {/* Issues List */}
                            <div className="space-y-2 pl-11">
                                {node.issues.map((issue, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <AlertTriangle
                                            size={14}
                                            className="text-amber-500 flex-shrink-0"
                                        />
                                        <span className="text-gray-600">
                                            {issue.message}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkflowChecklist;

