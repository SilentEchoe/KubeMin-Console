import { create } from 'zustand'
import { Node, Edge } from 'reactflow'
import { FlowState } from '../types/flow'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '开始节点' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: '处理节点 1' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    data: { label: '处理节点 2' },
    position: { x: 100, y: 225 },
  },
  {
    id: '4',
    data: { label: '处理节点 3' },
    position: { x: 400, y: 225 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: '结束节点' },
    position: { x: 250, y: 325 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
]

export const useFlowStore = create<FlowState>(() => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  selectedEdge: null,
}))