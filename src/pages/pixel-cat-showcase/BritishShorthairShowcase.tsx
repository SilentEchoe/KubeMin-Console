import React, { useState } from 'react';
import { Cat, Palette, Download, RotateCcw, Sparkles, Crown } from 'lucide-react';
import BritishShorthairCat32 from '../customers/components/BritishShorthairCat32';

const BritishShorthairShowcase: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [scale, setScale] = useState(4);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showSparkles, setShowSparkles] = useState(true);

  const backgroundColors = [
    { name: '白色', value: '#ffffff' },
    { name: '浅灰', value: '#f8fafc' },
    { name: '浅蓝', value: '#eff6ff' },
    { name: '深蓝', value: '#1e3a8a' },
    { name: '深色', value: '#0f172a' },
    { name: '皇家紫', value: '#6b21a8' },
    { name: '贵族蓝', value: '#1e40af' },
    { name: '翡翠绿', value: '#065f46' },
  ];

  const downloadCat = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 128;
    canvas.height = 128;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制英国短毛猫的简化版本用于下载
    ctx.fillStyle = '#9ca3af'; // 主体颜色
    ctx.fillRect(32, 64, 64, 32); // 身体
    ctx.fillRect(32, 32, 64, 32); // 头部
    ctx.fillStyle = '#6b7280'; // 耳朵颜色
    ctx.fillRect(32, 16, 16, 16);
    ctx.fillRect(80, 16, 16, 16);
    ctx.fillStyle = '#f59e0b'; // 眼睛颜色
    ctx.fillRect(48, 48, 8, 8);
    ctx.fillRect(72, 48, 8, 8);

    const link = document.createElement('a');
    link.download = 'british-shorthair-pixel-cat-32px.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              🇬🇧 英国短毛猫像素精灵
            </h1>
            <Crown className="w-8 h-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            精心设计的32像素英国短毛猫，展现优雅、高贵和可爱的完美结合
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            限量版像素艺术
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            自定义展示
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Background Color */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <Palette className="w-4 h-4 mr-1" />
                皇家背景颜色
              </label>
              <div className="grid grid-cols-4 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className={`w-10 h-10 rounded border-2 transition-all ${
                      backgroundColor === color.value ? 'border-purple-500 scale-110 shadow-lg' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Scale Control */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">缩放比例</label>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>1x (实际尺寸)</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
                <option value={16}>16x (放大)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {isAnimating ? '暂停' : '播放'}
              </button>
              <button
                onClick={() => setIsAnimating(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={downloadCat}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sparkle Toggle */}
          <div className="mt-4 flex items-center justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showSparkles}
                onChange={(e) => setShowSparkles(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                显示闪光效果
              </span>
            </label>
          </div>
        </div>

        {/* Main Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            英国短毛猫展示
            <Crown className="w-5 h-5 ml-2 text-yellow-500" />
          </h3>

          <div className="relative">
            <div
              className="flex items-center justify-center h-96 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
              style={{
                backgroundColor: backgroundColor,
                transform: `scale(${scale})`,
                transformOrigin: 'center'
              }}
            >
              {isAnimating && <BritishShorthairCat32 />}

              {/* Royal sparkles */}
              {showSparkles && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        left: `${15 + i * 12}%`,
                        top: `${15 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500">
              💎 使用缩放功能查看像素级细节
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600 text-center">
            32px × 32px 实际尺寸 × {scale} 倍缩放
          </div>
        </div>

        {/* Design Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Visual Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              视觉特色
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>银色渐变毛色：</strong>
                  真实的英国短毛猫银色被毛效果，从浅灰到深灰的自然过渡
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>折叠耳朵：</strong>
                  典型的英国短毛猫耳朵特征，圆润且位置较低
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>琥珀色眼睛：</strong>
                  明亮温暖的琥珀色眼睛，展现猫咪的温柔性格
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>圆润轮廓：</strong>
                  英国短毛猫特有的圆润头部和身体形状
                </div>
              </li>
            </ul>
          </div>

          {/* Technical Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Cat className="w-5 h-5 mr-2 text-purple-500" />
              技术特色
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>32×32 像素精确定位：</strong>
                  每个像素都经过精心调整，确保最佳视觉效果
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>游戏精灵风格：</strong>
                  专为游戏和应用程序设计的精灵图标准
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>极简色彩方案：</strong>
                  使用有限的色彩调色板，保持像素艺术的纯粹性
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-1"></span>
                <div>
                  <strong>清晰轮廓：</strong>
                  明暗对比强烈，轮廓清晰可见
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">使用示例</h3>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{`// 导入英国短毛猫组件
import BritishShorthairCat32 from '@/pages/customers/components/BritishShorthairCat32';

// 在加载状态中使用
{isLoading && (
  <div className="flex justify-center py-4">
    <BritishShorthairCat32 />
  </div>
)}

// 作为头像使用
<div className="w-8 h-8">
  <BritishShorthairCat32 />
</div>

// 游戏精灵使用
<div className="game-sprite">
  <BritishShorthairCat32 />
</div>`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BritishShorthairShowcase;