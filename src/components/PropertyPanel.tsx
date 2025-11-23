import React from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, setSelectedNode, updateNodeData } = useFlowStore();

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }

    const handleChange = (field: string, value: string) => {
        updateNodeData(selectedNode.id, { [field]: value });
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
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
                <div style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a' }}>
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
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#334155',
                            marginBottom: '8px',
                        }}
                    >
                        Label
                    </label>
                    <input
                        type="text"
                        value={selectedNode.data.label || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#334155',
                            marginBottom: '8px',
                        }}
                    >
                        Description
                    </label>
                    <textarea
                        value={selectedNode.data.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;
