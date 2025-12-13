import React, { useEffect, useState } from 'react';
import {
    Package,
    Database,
    Server,
    Cloud,
    Box,
    Layers,
    Cpu,
    Globe,
    Layout,
    Terminal
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Modal from './base/Modal';
import { fetchApp } from '../api/apps';
import GameIcon from '../assets/game.svg';
import ArrangementIcon from '../assets/arrangement.svg';
import SetIcon from '../assets/set.svg';

// Default icon background colors (matching AppCard)
const ICON_BACKGROUNDS = ['#dbeafe', '#fce7f3', '#fef3c7', '#ddd6fe', '#d1fae5', '#fecaca'];

const AVAILABLE_ICONS: Record<string, React.ElementType> = {
    Package,
    Database,
    Server,
    Cloud,
    Box,
    Layers,
    Cpu,
    Globe,
    Layout,
    Terminal
};

const Sidebar: React.FC = () => {
    const { appId } = useParams<{ appId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [isHovering, setIsHovering] = useState(false);

    const { data: app, isLoading } = useSWR(
        appId ? ['app', appId] : null,
        ([_, id]) => fetchApp(id)
    );

    useEffect(() => {
        if (app?.icon) {
            setSelectedIcon(app.icon);
        }
    }, [app]);

    // Generate a consistent background color based on app id
    const iconBackground = app?.id ? ICON_BACKGROUNDS[
        Math.abs(app.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % ICON_BACKGROUNDS.length
    ] : ICON_BACKGROUNDS[0];

    // Use app icon or default game.svg icon
    const displayIcon = app?.icon || GameIcon;

    const renderDisplayIcon = () => {
        if (app?.icon && AVAILABLE_ICONS[app.icon]) {
            const IconComponent = AVAILABLE_ICONS[app.icon];
            return <IconComponent size={32} />;
        }
        if (typeof displayIcon === 'string' && displayIcon.startsWith('/')) {
            return <img src={displayIcon} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
        }
        return <img src={displayIcon} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    };

    return (
        <div style={{
            width: '200px',
            height: '100%',
            borderRight: '1px solid #e5e5e5',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* App Icon and Name Area */}
            <div
                style={{
                    width: '200px',
                    padding: '10px 16px 12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: isHovering ? '#f5f5f5' : 'transparent',
                    transition: 'background-color 0.2s ease'
                }}
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                ) : (
                    <>
                        {/* Icon and Settings Row */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: iconBackground,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px'
                                }}
                            >
                                {renderDisplayIcon()}
                            </span>

                            {/* Settings Icon */}
                            <img
                                src={SetIcon}
                                alt="Settings"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        {/* App Name */}
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            lineHeight: '20px',
                            color: '#354052',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {app?.name ?? ''}
                        </div>
                        {/* App Namespace */}
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 400,
                            lineHeight: '16px',
                            color: '#94a3b8',
                            marginTop: '2px'
                        }}>
                            {app?.namespace || 'default'}
                        </div>
                        {/* App Version */}
                        {app?.version && (
                            <div style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: '16px',
                                color: '#94a3b8',
                                marginTop: '2px'
                            }}>
                                v{app.version}
                            </div>
                        )}

                    </>
                )}
            </div>

            {/* Navigation Menu */}
            <div style={{ padding: '8px 0' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        margin: '0 8px',
                        background: '#dbeafe',
                        color: '#155eef',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 400,
                        borderRadius: '8px',
                        transition: 'background-color 0.2s, color 0.2s'
                    }}
                >
                    <img src={ArrangementIcon} alt="Arrangement" style={{ width: '16px', height: '16px' }} />
                    <span>Arrangement</span>
                </div>
            </div>

            <Modal
                isShow={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit App Info"
            >
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter app name"
                            defaultValue={app?.name ?? ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter alias"
                            defaultValue={app?.alias ?? ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                        <input
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter project"
                            defaultValue={app?.project ?? ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedIcon(name)}
                                    className={`
                                        p-2 rounded-lg flex items-center justify-center transition-all
                                        ${selectedIcon === name
                                            ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500 ring-offset-1'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }
                                    `}
                                    title={name}
                                >
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter description"
                            defaultValue={app?.description ?? ''}
                            rows={3}
                        />
                    </div>

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
