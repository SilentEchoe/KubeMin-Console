import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FlowCanvas from '../components/FlowCanvas';
import Sidebar from '../components/Sidebar';
import PropertyPanel from '../components/PropertyPanel';

const WorkflowPage: React.FC = () => {
    const { appId } = useParams<{ appId: string }>();
    const navigate = useNavigate();

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header
                style={{
                    height: '60px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    background: '#fff',
                    zIndex: 10,
                    gap: '16px',
                }}
            >
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                    }}
                >
                    <ArrowLeft style={{ width: '18px', height: '18px', color: '#64748b' }} />
                </button>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                    KubeMin Console
                </div>
                {appId && (
                    <div style={{ fontSize: '14px', color: '#64748b', marginLeft: 'auto' }}>
                        App ID: {appId}
                    </div>
                )}
            </header>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Sidebar />
                <main style={{ flex: 1, position: 'relative' }}>
                    <FlowCanvas />
                    <PropertyPanel />
                </main>
            </div>
        </div>
    );
};

export default WorkflowPage;
