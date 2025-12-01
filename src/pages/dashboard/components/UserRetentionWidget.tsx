import React from 'react';
import WidgetCard from './WidgetCard';

const UserRetentionWidget: React.FC = () => {
    return (
        <WidgetCard title="User Retention">
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">24%</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-1 py-0.5 rounded">12.5% ↓</span>
                        <span className="text-xs text-gray-400">vs last month</span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-1 h-24 mt-auto">
                    {Array.from({ length: 48 }).map((_, i) => {
                        // Create a pattern similar to the image
                        const isFilled = i < 20 || (i > 23 && i < 30) || (i > 35 && i < 40);
                        return (
                            <div
                                key={i}
                                className={`rounded-sm ${isFilled ? 'bg-cyan-400' : 'bg-cyan-100'}`}
                            />
                        );
                    })}
                </div>
            </div>
        </WidgetCard>
    );
};

export default UserRetentionWidget;
