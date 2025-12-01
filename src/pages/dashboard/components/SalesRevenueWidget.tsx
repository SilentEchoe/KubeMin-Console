import React from 'react';
import WidgetCard from './WidgetCard';

const SalesRevenueWidget: React.FC = () => {
    return (
        <WidgetCard title="Sales Revenue">
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">$1,631,241</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-1 py-0.5 rounded">12.5% ↓</span>
                        <span className="text-xs text-gray-400">vs yesterday</span>
                    </div>
                </div>

                <div className="flex items-end justify-between h-32 gap-2 mt-auto">
                    {[40, 60, 30, 80, 50, 40, 60].map((height, i) => (
                        <div
                            key={i}
                            className={`w-full rounded-t-sm ${i === 3 ? 'bg-orange-500' : 'bg-gray-100'}`}
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
};

export default SalesRevenueWidget;
