import React from 'react';
import WidgetCard from './WidgetCard';

const ProductPerformanceWidget: React.FC = () => {
    return (
        <WidgetCard title="Product Performance">
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">22.8%</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-1 py-0.5 rounded">12.5% ↓</span>
                        <span className="text-xs text-gray-400">vs yesterday</span>
                    </div>
                </div>

                <div className="flex items-end justify-between h-32 gap-2 mt-auto">
                    {[50, 60, 60, 40, 55].map((height, i) => (
                        <div
                            key={i}
                            className="w-full rounded-t-lg bg-gradient-to-b from-orange-400 to-orange-600"
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </div>
        </WidgetCard>
    );
};

export default ProductPerformanceWidget;
