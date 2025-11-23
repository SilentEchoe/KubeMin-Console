# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run development server (default port 5173)
npm run dev

# Build for production (TypeScript check + Vite build)
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture Overview

**KubeMin Console** is a React-based workflow visualization platform using React Flow for node-based canvas interactions.

### Core Technologies
- **React 19.2.0** with TypeScript
- **React Flow 12.9.3** (@xyflow/react) - Canvas engine for node rendering and edge management
- **Zustand 5.0.8** - State management for workflow data
- **Vite 7.2.4** - Build tool and development server
- **Tailwind CSS 4.1.17** - Styling

### State Management Architecture

The application uses a single Zustand store (`src/stores/flowStore.ts`) that manages:
- `nodes[]` - React Flow nodes with custom data types
- `edges[]` - React Flow edges
- `selectedNodeId` - Currently selected node
- `controlMode` - Canvas interaction mode (Pointer/Hand)
- `panelMenu` - Context menu positioning
- `clipboard` - Copy/paste functionality

Key store methods:
- `addNode()` - Add new nodes to canvas
- `updateNodeData()` - Update node properties
- `onNodesChange/onEdgesChange` - Handle React Flow change events
- `deleteSelectedElements()` - Remove selected nodes/edges
- `copyNode()/pasteNode()` - Clipboard operations

### Component Structure

```
src/
├── components/          # React components
│   ├── FlowCanvas.tsx # Main React Flow canvas wrapper
│   ├── CustomNode.tsx # Custom node rendering component
│   ├── Sidebar.tsx    # Left panel for node selection
│   ├── PropertyPanel.tsx # Right panel for node properties
│   └── CanvasControl.tsx # Canvas control UI (zoom/pan)
├── pages/
│   └── HomePage.tsx   # Main layout container
├── stores/
│   └── flowStore.ts   # Zustand state management
├── types/
│   └── flow.ts        # TypeScript type definitions
└── hooks/
    └── useShortcuts.ts # Keyboard shortcut handling
```

### Data Types

**FlowNodeData** - Custom data attached to each node:
```typescript
{
  label: string;
  description?: string;
  icon?: string;
  componentType?: string;
  image?: string;
  namespace?: string;
  replicas?: number;
  content?: string;
}
```

### Development Patterns

1. **React Flow Integration**: All canvas operations go through React Flow's built-in change handlers, then update the Zustand store
2. **Type Safety**: Strict TypeScript with comprehensive type definitions for all custom data
3. **State Updates**: Use Zustand's `set()` method with functional updates for immutable state changes
4. **Component Communication**: Components subscribe to store slices using Zustand selectors

### Key Implementation Notes

- The canvas starts empty (no default nodes)
- Node selection is managed through both React Flow's selection state and the store's `selectedNodeId`
- Copy/paste creates new nodes with unique IDs and offset positioning
- Canvas control modes switch between pointer selection and hand panning
- All node/edge changes flow through React Flow's change handlers before updating the store