import React from 'react';
import { AppWindow, GitBranch } from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <div style={{
            width: '240px',
            height: '100%',
            borderRight: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* App Info */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#eff6ff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563eb'
                    }}>
                        <AppWindow size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>APP1</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>App Description</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ padding: '16px 12px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                }}>
                    <GitBranch size={18} />
                    <span>编排</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
