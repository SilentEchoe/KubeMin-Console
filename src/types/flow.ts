export interface CustomNodeData {
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  description?: string;
}

export interface CustomEdgeData {
  label?: string;
  type: 'success' | 'error' | 'default';
}

export interface FlowState {
  nodes: any[];
  edges: any[];
  selectedNode: any | null;
  selectedEdge: any | null;
}