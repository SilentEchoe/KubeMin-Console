import React, { useState, useEffect } from 'react';
import PixelCatLoader32 from './components/PixelCatLoader32';

const Demo32px: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 自动停止加载以便对比
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const toggleLoading = () => {
        setLoading(!loading);
    };

    return (
        <div className="p-8 bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-6">32px 像素猫加载动画演示</h2>

            <div className="space-y-6">
                {/* 实际大小显示 */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">实际32px尺寸</h3>
                    <div className="flex items-center space-x-4">
                        <div className="border-2 border-red-300 w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                            {loading ? <PixelCatLoader32 /> : <div className="w-6 h-6 bg-green-400 rounded"></div>}
                        </div>
                        <span className="text-xs text-gray-600">
                            {loading ? '加载中...' : '加载完成'}
                        </span>
                        <button
                            onClick={toggleLoading}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                            {loading ? '停止' : '开始'}
                        </button>
                    </div>
                </div>

                {/* 模拟列表加载 */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">模拟客户列表加载</h3>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <PixelCatLoader32 />
                        </div>
                    )}
                </div>

                {/* 模拟卡片加载 */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">模拟卡片网格加载</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border border-gray-200 rounded p-3 h-20 bg-gray-50">
                                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <PixelCatLoader32 />
                        </div>
                    )}
                </div>

                {/* 尺寸对比 */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">尺寸对比</h3>
                    <div className="flex items-end space-x-4">
                        <div className="text-center">
                            <div className="border-2 border-blue-300 w-8 h-8 flex items-center justify-center">
                                <PixelCatLoader32 />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">32px</p>
                        </div>
                        <div className="text-center">
                            <div className="border-2 border-green-300 w-16 h-16 flex items-center justify-center">
                                <div className="scale-50">
                                    <PixelCatLoader32 />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">64px (2x)</p>
                        </div>
                        <div className="text-center">
                            <div className="border-2 border-purple-300 w-24 h-24 flex items-center justify-center">
                                <div className="scale-75">
                                    <PixelCatLoader32 />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">96px (3x)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Demo32px;