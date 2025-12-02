import React, { useState } from 'react';
import { Cat, Star, Heart, Palette, Download, RotateCcw } from 'lucide-react';
import PixelCatLoader32 from '../customers/components/PixelCatLoader32';
import BritishShorthairCat32 from '../customers/components/BritishShorthairCat32';

const CatComparison: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<'original' | 'british'>('british');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [scale, setScale] = useState(4);
  const [isAnimating, setIsAnimating] = useState(true);

  const backgroundColors = [
    { name: '白色', value: '#ffffff' },
    { name: '浅灰', value: '#f8fafc' },
    { name: '浅蓝', value: '#eff6ff' },
    { name: '深蓝', value: '#1e3a8a' },
    { name: '深色', value: '#0f172a' },
  ];

  const downloadCat = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 128;
    canvas.height = 128;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制像素猫
    ctx.fillStyle = selectedCat === 'british' ? '#9ca3af' : '#9ca3af';

    if (selectedCat === 'british') {
      // British Shorthair 设计
      ctx.fillStyle = '#d1d5db'; // 主体颜色
      ctx.fillRect(32, 64, 64, 32); // 身体
      ctx.fillRect(32, 32, 64, 32); // 头部
      ctx.fillStyle = '#9ca3af'; // 耳朵颜色
      ctx.fillRect(32, 16, 16, 16);
      ctx.fillRect(80, 16, 16, 16);
      ctx.fillStyle = '#fbbf24'; // 眼睛颜色
      ctx.fillRect(48, 48, 8, 8);
      ctx.fillRect(72, 48, 8, 8);
    } else {
      // 原始设计
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(32, 64, 64, 32);
      ctx.fillRect(32, 32, 64, 32);
      ctx.fillRect(32, 16, 16, 16);
      ctx.fillRect(80, 16, 16, 16);
    }

    const link = document.createElement('a');
    link.download = `${selectedCat}-pixel-cat-32px.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐱 像素猫设计对比展示
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            对比展示原始设计和全新的英国短毛猫设计，体验不同的像素艺术风格
          </p>
        </div>

        {/* Design Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Cat className="w-5 h-5 mr-2" />
            选择设计版本
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedCat('original')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCat === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              原始设计
            </button>
            <button
              onClick={() => setSelectedCat('british')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCat === 'british'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              英国短毛猫
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Background Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <Palette className="w-4 h-4 mr-1" />
                背景颜色
              </label>
              <div className="flex gap-1">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      backgroundColor === color.value ? 'border-blue-500 scale-110' : 'border-gray-300'
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
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
                <option value={16}>16x</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
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
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {selectedCat === 'british' ? '🇬🇧 英国短毛猫设计' : '🐱 原始设计'}
          </h3>

          <div
            className="flex items-center justify-center h-96 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
            style={{
              backgroundColor: backgroundColor,
              transform: `scale(${scale})`,
              transformOrigin: 'center'
            }}
          >
            {isAnimating && (
              selectedCat === 'british' ? <BritishShorthairCat32 /> : <PixelCatLoader32 />
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600 text-center">
            32px × 32px 实际尺寸 × {scale} 倍缩放
          </div>
        </div>

        {/* Design Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Design Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-500" />
              原始设计特色
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>趴着睡觉的姿势</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>简单的灰色配色</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>可爱的"Z"字母动画</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>极简主义风格</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>适合加载动画</li>
            </ul>
          </div>

          {/* British Shorthair Design Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-purple-500" />
              英国短毛猫设计特色
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>英国短毛猫品种特征</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>银色渐变毛色</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>折叠耳朵设计</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>琥珀色眼睛</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>优雅闪光效果</li>
            </ul>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">技术规格</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">通用规格</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 尺寸：32px × 32px</li>
                <li>• 格式：React 组件</li>
                <li>• 风格：像素艺术</li>
                <li>• 动画：CSS 关键帧</li>
                <li>• 用途：加载指示器</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">英国短毛猫特色</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 品种特征明显</li>
                <li>• 银色渐变效果</li>
                <li>• 折叠耳朵设计</li>
                <li>• 优雅闪光动画</li>
                <li>• 游戏精灵风格</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatComparison;