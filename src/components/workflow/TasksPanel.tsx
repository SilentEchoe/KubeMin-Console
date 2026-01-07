import React from 'react';
import useSWR from 'swr';
import { fetchTaskHistory } from '../../api/apps';
import type { TaskHistoryItem } from '../../api/apps';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

interface TasksPanelProps {
    appId: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
    completed: { icon: CheckCircle2, color: '#16a34a', bgColor: '#dcfce7', label: 'Completed' },
    running: { icon: Loader2, color: '#2563eb', bgColor: '#dbeafe', label: 'Running' },
    failed: { icon: XCircle, color: '#dc2626', bgColor: '#fee2e2', label: 'Failed' },
    cancelled: { icon: XCircle, color: '#6b7280', bgColor: '#f3f4f6', label: 'Cancelled' },
    timeout: { icon: AlertCircle, color: '#ea580c', bgColor: '#ffedd5', label: 'Timeout' },
    waiting: { icon: Clock, color: '#6b7280', bgColor: '#f3f4f6', label: 'Waiting' },
    queued: { icon: Clock, color: '#6b7280', bgColor: '#f3f4f6', label: 'Queued' },
    prepare: { icon: Clock, color: '#6b7280', bgColor: '#f3f4f6', label: 'Preparing' },
    reject: { icon: XCircle, color: '#dc2626', bgColor: '#fee2e2', label: 'Rejected' },
};

const formatDuration = (startTime?: string | number, endTime?: string | number): string => {
    if (!startTime) return '-';
    const start = typeof startTime === 'number' ? startTime : new Date(startTime).getTime();
    const end = endTime ? (typeof endTime === 'number' ? endTime : new Date(endTime).getTime()) : Date.now();
    const durationMs = end - start;

    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
};

const formatTime = (time?: string | number): string => {
    if (!time) return '-';
    const date = typeof time === 'number' ? new Date(time) : new Date(time);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const TasksPanel: React.FC<TasksPanelProps> = ({ appId }) => {
    const { data: tasks, isLoading, error } = useSWR(
        ['taskHistory', appId],
        () => fetchTaskHistory(appId),
        { refreshInterval: 5000 }
    );

    return (
        <div
            style={{
                flex: 1,
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                    Task History
                </h3>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
                {isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: '#6b7280' }} />
                    </div>
                )}

                {error && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
                        Failed to load task history
                    </div>
                )}

                {!isLoading && !error && tasks && tasks.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                        No task history found
                    </div>
                )}

                {!isLoading && !error && tasks && tasks.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                                    Name
                                </th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                                    Time
                                </th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                                    Duration
                                </th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task: TaskHistoryItem, index: number) => {
                                const config = statusConfig[task.status] || statusConfig.waiting;
                                const StatusIcon = config.icon;

                                return (
                                    <tr
                                        key={task.id || `task-${index}`}
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                                            transition: 'background-color 0.15s',
                                        }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                                                {task.name || task.workflowName || 'Unnamed Task'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                {task.workflowName}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                                            {formatTime(task.startTime)}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                                            {formatDuration(task.startTime, task.endTime)}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: config.color,
                                                    backgroundColor: config.bgColor,
                                                }}
                                            >
                                                <StatusIcon size={14} className={task.status === 'running' ? 'animate-spin' : ''} />
                                                {config.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TasksPanel;
