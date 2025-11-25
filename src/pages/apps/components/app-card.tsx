import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Copy, Download, Trash2 } from 'lucide-react';
import type { App } from '../../../types/app';
import { duplicateApp, exportApp, deleteApp } from '../../../api/apps';

interface AppCardProps {
    app: App;
    onUpdate: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onUpdate }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleCardClick = () => {
        navigate(`/workflow/${app.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/workflow/${app.id}`);
    };

    const handleDuplicate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await duplicateApp(app.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to duplicate app:', error);
        }
    };

    const handleExport = async (e: React.MouseEvent) => {
        e.stopPropagation();
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

    return (
        <div
            className="group relative bg-white rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Content */}
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: app.iconBackground }}
                    >
                        {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                            {app.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{app.createdBy}</span>
                            <span>•</span>
                            <span>{formatDate(app.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {app.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {app.tags.map(tag => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                                backgroundColor: `${tag.color}15`,
                                color: tag.color,
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hover Actions */}
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-end p-4 gap-2">
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={handleDuplicate}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="Duplicate"
                    >
                        <Copy className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                        title="Export"
                    >
                        <Download className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-white/90 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            )}
        </div>
    );
};
