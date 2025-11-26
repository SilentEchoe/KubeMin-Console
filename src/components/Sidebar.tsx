import React from 'react';
import { GitBranch } from 'lucide-react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Modal from './base/Modal';
import { fetchApp } from '../api/apps';

// Default icon background colors (matching AppCard)
const ICON_BACKGROUNDS = ['#dbeafe', '#fce7f3', '#fef3c7', '#ddd6fe', '#d1fae5', '#fecaca'];
const DEFAULT_ICON = '📦';

const Sidebar: React.FC = () => {
    const { appId } = useParams<{ appId: string }>();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { data: app, isLoading } = useSWR(
        appId ? ['app', appId] : null,
        ([_, id]) => fetchApp(id)
    );

    // Generate a consistent background color based on app id
    const iconBackground = app?.id ? ICON_BACKGROUNDS[
        Math.abs(app.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % ICON_BACKGROUNDS.length
    ] : ICON_BACKGROUNDS[0];

    const displayIcon = app?.icon || DEFAULT_ICON;

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
                        background: iconBackground,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                    }}>
                        {isLoading ? (
                            <div className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full" />
                        ) : (
                            displayIcon
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {app?.name || 'Loading...'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {app?.description || 'No description'}
                                </div>
                            </>
                        )}
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
                        defaultValue={app?.name}
                    />

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Description</label>
                    <textarea
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter description"
                        defaultValue={app?.description}
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
