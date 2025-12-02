import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Download, Settings, Grid, Palette, Cat, Heart, Star, Zap } from 'lucide-react';
import PixelCatLoader32 from '../customers/components/PixelCatLoader32';
import Navigation from './Navigation';

const PixelCatShowcase: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showGrid, setShowGrid] = useState(true);
  const [scale, setScale] = useState(1);
  const [displayMode, setDisplayMode] = useState<'single' | 'grid' | 'rainbow' | 'wave' | 'heart'>('single');
  const [clickCount, setClickCount] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const backgroundColors = [
    { name: '白色', value: '#ffffff' },
    { name: '浅灰', value: '#f8fafc' },
    { name: '浅蓝', value: '#eff6ff' },
    { name: '深蓝', value: '#1e3a8a' },
    { name: '深色', value: '#0f172a' },
  ];

  const resetAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  const handleCatClick = () => {
    setClickCount(prev => prev + 1);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);
  };

  const downloadAsPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 128;
    canvas.height = 128;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple pixel cat representation for download
    ctx.fillStyle = '#9ca3af';
    // Body
    ctx.fillRect(32, 64, 64, 32);
    // Head
    ctx.fillRect(32, 32, 64, 32);
    // Ears
    ctx.fillRect(32, 16, 16, 16);
    ctx.fillRect(80, 16, 16, 16);

    const link = document.createElement('a');
    link.download = 'pixel-cat-32px.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🐱 32px 像素猫加载动画展示
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              专门展示可爱的32像素趴着睡觉的小猫加载动画，支持多种展示模式和自定义选项
            </p>
            {clickCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4" />
                猫咪被点击了 {clickCount} 次
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              控制面板
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Animation Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">动画控制</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAnimating ? '暂停' : '播放'}
                  </button>
                  <button
                    onClick={resetAnimation}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Palette className="w-4 h-4 mr-1" />
                  背景颜色
                </label>
                <div className="flex gap-1">
                  {backgroundColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBackgroundColor(color.value)}
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        backgroundColor === color.value ? 'border-blue-500 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Scale Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">缩放比例</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                  <option value={8}>8x</option>
                </select>
              </div>

              {/* Additional Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">显示选项</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">显示网格</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={downloadAsPNG}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                下载 PNG
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Single Cat Display */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                单个动画展示
              </h3>
              <div className="relative">
                <div
                  className={`flex items-center justify-center h-64 rounded-xl border-2 border-dashed transition-all cursor-pointer hover:border-blue-400 ${
                    showGrid ? 'border-gray-300 bg-gray-50' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: backgroundColor,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center'
                  }}
                  onClick={handleCatClick}
                >
                  {isAnimating && <PixelCatLoader32 />}

                  {/* Heart animation */}
                  {showHearts && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-ping"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${20 + (i % 2) * 20}%`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        >
                          <Heart className="w-4 h-4 text-pink-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Click hint */}
                <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500">
                  💡 点击猫咪与它互动！
                </div>
              </div>
              <div className="mt-8 text-sm text-gray-600 text-center">
                32px × 32px 实际尺寸 × {scale} 倍缩放
              </div>
            </div>

            {/* Multiple Cats Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Grid className="w-5 h-5 mr-2 text-purple-500" />
                网格展示模式
              </h3>
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { mode: 'single', label: '单个', icon: Cat },
                    { mode: 'grid', label: '网格', icon: Grid },
                    { mode: 'rainbow', label: '彩虹', icon: Zap },
                    { mode: 'wave', label: '波浪', icon: Star },
                    { mode: 'heart', label: '心形', icon: Heart },
                  ].map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setDisplayMode(mode as any)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        displayMode === mode
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className="grid gap-4 h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4"
                style={{ backgroundColor: backgroundColor }}
              >
                {displayMode === 'single' && (
                  <div className="flex items-center justify-center">
                    {isAnimating && <PixelCatLoader32 />}
                  </div>
                )}
                {displayMode === 'grid' && Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {isAnimating && <PixelCatLoader32 />}
                  </div>
                ))}
                {displayMode === 'rainbow' && Array.from({ length: 20 }, (_, i) => {
                  const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff'];
                  return (
                    <div key={i} className="flex items-center justify-center" style={{ backgroundColor: colors[i % colors.length], borderRadius: '4px' }}
                    >
                      {isAnimating && <PixelCatLoader32 />}
                    </div>
                  );
                })}
                {displayMode === 'wave' && Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{
                      transform: `translateY(${Math.sin(i * 0.5) * 10}px)`,
                      animation: `wave 2s ease-in-out infinite ${i * 0.1}s`
                    }}
                  >
                    {isAnimating && <PixelCatLoader32 />}
                  </div>
                ))}
                {displayMode === 'heart' && [
                  [0,1,0,1,0],
                  [1,1,1,1,1],
                  [1,1,1,1,1],
                  [0,1,1,1,0],
                  [0,0,1,0,0]
                ].map((row, i) => (
                  <div key={i} className="flex justify-center space-x-2">
                    {row.map((cell, j) => (
                      <div key={j} className="flex items-center justify-center">
                        {cell === 1 && isAnimating && <PixelCatLoader32 />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                {displayMode === 'single' && '单个像素猫展示'}
                {displayMode === 'grid' && '4×4 网格展示 - 16只像素猫同时加载'}
                {displayMode === 'rainbow' && '彩虹模式 - 彩色背景展示'}
                {displayMode === 'wave' && '波浪模式 - 动态波浪效果'}
                {displayMode === 'heart' && '心形模式 - 爱心形状排列'}
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">技术信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">动画规格</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 尺寸：32px × 32px</li>
                  <li>• 格式：React 组件</li>
                  <li>• 动画：CSS 关键帧动画</li>
                  <li>• 像素风格：8位复古风格</li>
                  <li>• 姿势：趴着睡觉</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">使用场景</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 客户列表加载</li>
                  <li>• 数据请求等待</li>
                  <li>• 页面过渡动画</li>
                  <li>• 小尺寸加载指示器</li>
                  <li>• 复古游戏风格界面</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">使用示例</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`// 导入组件
import PixelCatLoader32 from '@/pages/customers/components/PixelCatLoader32';

// 在加载状态中使用
{isLoading && (
  <div className="flex justify-center py-4">
    <PixelCatLoader32 />
  </div>
)}

// 或者直接在需要的地方使用
<PixelCatLoader32 />`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for wave animation */}
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default PixelCatShowcase;