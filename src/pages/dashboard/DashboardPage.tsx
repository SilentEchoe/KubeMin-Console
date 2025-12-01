import React from 'react';
import Sidebar from './components/Sidebar';
import SalesRevenueWidget from './components/SalesRevenueWidget';
import SegmentationWidget from './components/SegmentationWidget';
import ProductPerformanceWidget from './components/ProductPerformanceWidget';
import TaskCompletionWidget from './components/TaskCompletionWidget';
import UserRetentionWidget from './components/UserRetentionWidget';
import LeadsByStatusWidget from './components/LeadsByStatusWidget';

const DashboardPage: React.FC = () => {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto bg-white p-8">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                    <h1 className="text-sm font-medium text-gray-900">Manage Widgets</h1>
                    <span className="text-xs text-gray-400">204 AVAILABLE</span>
                </div>

                {/* Sales & Financial Insights */}
                <div className="mb-12">
                    <h2 className="text-lg font-medium text-gray-900 mb-1">Sales & Financial Insights</h2>
                    <p className="text-sm text-gray-500 mb-6">Monitor financial health and analyze key sales metrics</p>
                    <div className="grid grid-cols-3 gap-6">
                        <SalesRevenueWidget />
                        <SegmentationWidget />
                        <ProductPerformanceWidget />
                    </div>
                </div>

                {/* Goals & Tasks Tracking */}
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-1">Goals & Tasks Tracking</h2>
                    <p className="text-sm text-gray-500 mb-6">Track team productivity and measure progress toward goals</p>
                    <div className="grid grid-cols-3 gap-6">
                        <TaskCompletionWidget />
                        <UserRetentionWidget />
                        <LeadsByStatusWidget />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
