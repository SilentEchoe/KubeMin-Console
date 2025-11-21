import React, { useCallback } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowStore } from '../stores/flowStore'

const FlowCanvas: React.FC = () => {
  const { nodes: initialNodes, edges: initialEdges } = useFlowStore()
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="w-full h-96 border rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default FlowCanvas