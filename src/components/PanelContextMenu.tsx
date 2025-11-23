import React, { useRef, useEffect, useState } from 'react';
import { useFlowStore } from '../stores/flowStore';
import { Plus, FileText, Play, Clipboard, Download, Upload, ChevronRight } from 'lucide-react';
import BlockSelector from './BlockSelector';

const PanelContextMenu: React.FC = () => {
    const { panelMenu, setPanelMenu, addNode } = useFlowStore();
    const ref = useRef<HTMLDivElement>(null);
    const [showAddBlock, setShowAddBlock] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setPanelMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setPanelMenu]);

    if (!panelMenu) return null;

    const handleAddBlock = (type: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        addNode({
            id,
            type: 'custom',
            position: { x: panelMenu.left + 50, y: panelMenu.top + 50 }, // Offset slightly
            data: {
                label: type.toUpperCase(),
                description: `New ${type} node`,
                icon: 'box',
            },
        });
        setPanelMenu(null);
    };

    return (
        <div
            className="absolute z-[9] w-[200px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg backdrop-blur-sm"
            style={{
                left: panelMenu.left,
                top: panelMenu.top,
            }}
            ref={ref}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="p-1">
                {/* Add Block */}
                <div
                    className="relative flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
                    onMouseEnter={() => setShowAddBlock(true)}
                    onMouseLeave={() => setShowAddBlock(false)}
                >
                    <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Block</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" />

                    {/* Submenu for Block Selector */}
                    {showAddBlock && (
                        <div className="absolute left-full top-0 ml-1 z-50">
                            <BlockSelector onSelect={handleAddBlock} onClose={() => { }} />
                        </div>
                    )}
                </div>

                {/* Add Note */}
                <div className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Add Note</span>
                    </div>
                </div>

                {/* Run */}
                <div className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover">
                    <div className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        <span>Run</span>
                    </div>
                    <span className="text-xs text-text-tertiary">Alt+R</span>
                </div>
            </div>

            <div className="my-1 h-[0.5px] bg-components-panel-border" />

            <div className="p-1">
                {/* Paste */}
                <div className="flex h-8 cursor-not-allowed items-center justify-between rounded-lg px-3 text-sm text-text-secondary opacity-50">
                    <div className="flex items-center gap-2">
                        <Clipboard className="h-4 w-4" />
                        <span>Paste</span>
                    </div>
                    <span className="text-xs text-text-tertiary">Ctrl+V</span>
                </div>
            </div>

            <div className="my-1 h-[0.5px] bg-components-panel-border" />

            <div className="p-1">
                {/* Export */}
                <div className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover">
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </div>
                </div>

                {/* Import DSL */}
                <div className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover">
                    <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Import DSL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelContextMenu;
