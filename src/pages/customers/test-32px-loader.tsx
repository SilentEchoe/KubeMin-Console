import React, { useState } from 'react';
import PixelCatLoader32 from './components/PixelCatLoader32';
import PixelCatLoader from './components/PixelCatLoader';

const Test32pxLoader: React.FC = () => {
    const [showLarge, setShowLarge] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">像素猫加载动画对比测试</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* 32px 版本 */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">32px 紧凑版本</h2>
                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                        <PixelCatLoader32 />
                    </div>
                    <p className="text-sm text-gray-600">实际尺寸: 32px × 32px</p>
                    <p className="text-xs text-gray-500 mt-2">用于正常加载状态</p>
                </div>

                {/* 大尺寸版本 */}
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">大尺寸版本</h2>
                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 h-32 flex items-center justify-center">
                        <PixelCatLoader />
                    </div>
                    <p className="text-sm text-gray-600">实际尺寸: 240px × 192px (带缩放)</p>
                    <p className="text-xs text-gray-500 mt-2">用于测试按钮全屏显示</p>
                </div>
            </div>

            {/* 实际应用场景演示 */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">实际应用场景</h2>

                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">列表加载状态</h3>
                        <div className="flex items-center justify-center py-4 bg-gray-50 rounded">
                            <PixelCatLoader32 />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">客户列表底部加载更多数据时显示</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-2">内联加载状态</h3>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">正在搜索客户...</span>
                            <PixelCatLoader32 />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">搜索/筛选时内联显示</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => setShowLarge(!showLarge)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    {showLarge ? '隐藏' : '显示'} 大尺寸版本
                </button>
            </div>

            {showLarge && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl">
                        <div className="text-center mb-4">
                            <PixelCatLoader />
                        </div>
                        <button
                            onClick={() => setShowLarge(false)}
                            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            关闭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test32pxLoader;