import React from 'react';
import { AppWindow, GitBranch } from 'lucide-react';
import Modal from './base/Modal';

const Sidebar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

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
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpen(true)}
                >
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

            <Modal
                isShow={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit App Info"
            >
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                    <input
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter app name"
                        defaultValue="APP1"
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Description</label>
                    <textarea
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter description"
                        defaultValue="App Description"
                        rows={3}
                    />

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Sidebar;
