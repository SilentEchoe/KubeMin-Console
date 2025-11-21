import React from 'react'
import FlowCanvas from '../components/FlowCanvas'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">企业级工作流平台</h1>
            <div className="text-sm text-gray-500">
              React Flow + React 18 + TypeScript + Zustand + Tailwind CSS
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">工作流画布</h2>
              <FlowCanvas />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系统信息</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>状态: <span className="text-green-600 font-medium">运行正常</span></div>
                <div>版本: v1.0.0</div>
                <div>节点数量: 动态计算</div>
                <div>连接数量: 动态计算</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">技术栈</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">React 18</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">React Flow</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TypeScript</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zustand</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tailwind CSS</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage