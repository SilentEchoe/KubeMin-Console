import React from 'react';
import WidgetCard from './WidgetCard';

const TaskCompletionWidget: React.FC = () => {
    return (
        <WidgetCard title="Task Completion Rate">
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">58%</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-1 py-0.5 rounded">12.5% ↓</span>
                        <span className="text-xs text-gray-400">vs yesterday</span>
                    </div>
                </div>

                <div className="flex items-end gap-1 h-16 mt-auto">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-full rounded-sm ${i < 12 ? 'bg-cyan-500' : 'bg-gray-100'}`}
                            style={{ height: '100%' }}
                        />
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
};

export default TaskCompletionWidget;
