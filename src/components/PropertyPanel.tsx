import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, setSelectedNode } = useFlowStore();

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }



    return (
        <div
            style={{
                position: 'absolute',
                top: '70px',
                right: '20px',
                bottom: '20px',
                width: '320px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ fontWeight: 1200, fontSize: '16px', color: '#0f172a' }}>
                    Properties
                </div>
                <button
                    onClick={() => setSelectedNode(null)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Model Selection */}
                <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500 uppercase">
                        Model
                    </label>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 border border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                                G
                            </div>
                            <span className="text-sm text-gray-700 font-medium">gpt-4o</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Context */}
                <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500 uppercase">
                        Context
                    </label>
                    <div className="rounded-lg border border-dashed border-gray-300 p-2 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <span className="text-xs text-gray-500">Add Context</span>
                    </div>
                </div>

                {/* System Prompt */}
                <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-gray-500 uppercase">
                        System Prompt
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px] resize-none"
                            placeholder="You are a helpful assistant..."
                            defaultValue={selectedNode.data.description || ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;
