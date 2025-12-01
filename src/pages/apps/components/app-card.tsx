import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Copy, Download, Trash2, MoreVertical } from 'lucide-react';
import type { App } from '../../../types/app';
import { duplicateApp, exportApp, deleteApp } from '../../../api/apps';
import GameIcon from '../../../assets/game.svg';

interface AppCardProps {
    app: App;
    onUpdate: () => void;
}

// Default icon background colors
const ICON_BACKGROUNDS = ['#dbeafe', '#fce7f3', '#fef3c7', '#ddd6fe', '#d1fae5', '#fecaca'];

export const AppCard: React.FC<AppCardProps> = ({ app, onUpdate }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleCardClick = () => {
        navigate(`/workflow/${app.id}`);
    };

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        navigate(`/workflow/${app.id}`);
    };

    const handleDuplicate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        try {
            await duplicateApp(app.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to duplicate app:', error);
        }
    };

    const handleExport = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        try {
            const blob = await exportApp(app.id);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${app.name}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export app:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        if (confirm(`Are you sure you want to delete "${app.name}"?`)) {
            try {
                await deleteApp(app.id);
                onUpdate();
            } catch (error) {
                console.error('Failed to delete app:', error);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 30) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Use app icon or default game.svg icon
    const displayIcon = app.icon || GameIcon;

    // Generate a consistent background color based on app id
    const iconBackground = ICON_BACKGROUNDS[
        Math.abs(app.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % ICON_BACKGROUNDS.length
    ];

    return (
        <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col cursor-pointer relative w-[310px] h-[160px]"
            onClick={handleCardClick}
        >
            {/* More Options Button */}
            <div className="absolute bottom-4 right-4" ref={menuRef}>
                <button
                    onClick={handleMenuToggle}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="More options"
                >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                            onClick={handleEdit}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            <span>编辑信息</span>
                        </button>
                        <button
                            onClick={handleDuplicate}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            <span>复制</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>导出 DSL</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>删除</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 p-2"
                    style={{ backgroundColor: iconBackground }}
                >
                    {typeof displayIcon === 'string' && displayIcon.startsWith('/') ? (
                        <img src={displayIcon} alt="App icon" className="w-full h-full object-contain" />
                    ) : (
                        <img src={displayIcon} alt="App icon" className="w-full h-full object-contain" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                        {app.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="truncate">{app.alias}</span>
                        <span>•</span>
                        <span>{formatDate(app.updateTime)}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-1">
                {app.description || '暂无描述'}
            </p>

            {/* Additional Info */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                <span>创建于 {formatDate(app.createTime)}</span>
            </div>
        </div>
    );
};
