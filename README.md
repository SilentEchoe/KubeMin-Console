# KubeMin Console

企业级前端工作流平台，基于现代化的技术栈构建。

## 🚀 技术栈

- **React 18** - 现代化前端框架
- **React Flow (v12+)** - 核心画布引擎，负责节点渲染和连线管理
- **Zustand** - 轻量级状态管理，处理工作流状态
- **Vite** - 构建工具
- **TypeScript** - 类型安全

## 📦 安装和运行

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```
访问 http://localhost:3000

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   └── FlowCanvas.tsx  # React Flow 画布组件
├── pages/              # 页面组件
│   └── HomePage.tsx    # 主页组件
├── stores/             # Zustand 状态管理
│   └── flowStore.ts    # 工作流状态存储
├── types/              # TypeScript 类型定义
│   └── flow.ts         # 工作流相关类型
├── App.tsx             # 应用主组件
├── main.tsx            # 应用入口文件
└── index.css           # 全局样式

public/                 # 静态资源
├── vite.svg           # Vite 图标
└── index.html         # HTML 模板
```

## 🎨 功能特性

### 已实现功能
- ✅ React 18 + TypeScript 环境配置
- ✅ React Flow 画布集成
- ✅ Zustand 状态管理
- ✅ Vite 构建工具配置
- ✅ 简洁的主页界面
- ✅ 工作流节点和边的可视化
- ✅ 节点拖拽和连接功能
- ✅ 响应式布局

### 工作流功能
- 节点创建、编辑、删除
- 节点之间的连接管理
- 画布缩放和平移
- 节点位置保存和加载
- 工作流状态管理

## 🛠️ 开发指南

### 添加新的节点类型
1. 在 `src/types/flow.ts` 中定义新的节点数据类型
2. 在 `src/components` 中创建新的节点组件
3. 在 React Flow 配置中注册新的节点类型

### 状态管理
使用 Zustand 进行状态管理，主要状态存储在 `src/stores/flowStore.ts` 中。

### 样式系统
使用纯 CSS 进行样式管理，避免复杂的 CSS 框架依赖。

## 🔧 配置说明

### Vite 配置
- 端口：3000
- 构建输出目录：dist
- 支持热更新和模块热替换

### TypeScript 配置
- 严格模式启用
- ES2020 目标
- JSX 支持

## 🚦 运行状态

- ✅ 开发服务器正常运行
- ✅ 生产构建成功
- ✅ TypeScript 编译通过
- ✅ React Flow 集成完成

## 📈 性能优化

- 代码分割和懒加载
- 生产环境压缩优化
- Tree shaking 支持
- Source map 生成

## 🔒 安全特性

- TypeScript 类型检查
- XSS 防护
- 输入验证
- 安全的默认配置
