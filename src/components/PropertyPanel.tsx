import React from 'react';
import { X } from 'lucide-react';
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
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
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


        </div>
    );
};

export default PropertyPanel;
