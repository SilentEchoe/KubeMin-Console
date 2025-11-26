import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useSWR from 'swr';
import FlowCanvas from '../components/FlowCanvas';
import Sidebar from '../components/Sidebar';
import PropertyPanel from '../components/PropertyPanel';
import { fetchApp } from '../api/apps';

// Default icon background colors (matching AppCard)
const ICON_BACKGROUNDS = ['#dbeafe', '#fce7f3', '#fef3c7', '#ddd6fe', '#d1fae5', '#fecaca'];
const DEFAULT_ICON = '📦';

const WorkflowPage: React.FC = () => {
    const { appId } = useParams<{ appId: string }>();
    const navigate = useNavigate();

    const { data: app, isLoading } = useSWR(
        appId ? ['app', appId] : null,
        ([_, id]) => fetchApp(id)
    );

    // Generate a consistent background color based on app id
    const iconBackground = app?.id ? ICON_BACKGROUNDS[
        Math.abs(app.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % ICON_BACKGROUNDS.length
    ] : ICON_BACKGROUNDS[0];

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

                {isLoading ? (
                    <div className="animate-pulse h-6 w-32 bg-gray-200 rounded" />
                ) : app ? (
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: iconBackground }}
                        >
                            {app.icon || DEFAULT_ICON}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-sm leading-tight">
                                {app.name}
                            </div>
                            {app.alias && (
                                <div className="text-xs text-gray-500 leading-tight">
                                    {app.alias}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                        KubeMin Console
                    </div>
                )}

                {appId && !app && !isLoading && (
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
