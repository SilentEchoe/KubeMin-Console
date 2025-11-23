import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Hand, Plus } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { ControlMode } from '../types/flow';
import BlockSelector from './BlockSelector';

const CanvasControl: React.FC = () => {
    const { controlMode, setControlMode, addNode } = useFlowStore();
    const [showAddBlock, setShowAddBlock] = useState(false);
    const addBlockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addBlockRef.current && !addBlockRef.current.contains(event.target as Node)) {
                setShowAddBlock(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddBlock = (type: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        addNode({
            id,
            type: 'custom',
            position: { x: Math.random() * 500 + 100, y: Math.random() * 500 + 100 },
            data: {
                label: type.charAt(0).toUpperCase() + type.slice(1),
                description: '',
                icon: 'box',
            },
        });
        setShowAddBlock(false);
    };

    return (
        <div className="pointer-events-none absolute left-4 top-4 z-50 flex flex-col items-start gap-2">
            <div className="pointer-events-auto flex flex-col items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 text-text-tertiary shadow-lg">
                {/* Pointer Mode */}
                <div
                    className={`mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${controlMode === ControlMode.Pointer
                        ? 'bg-state-accent-active text-text-accent'
                        : 'hover:bg-state-base-hover hover:text-text-secondary'
                        } `}
                    onClick={() => setControlMode(ControlMode.Pointer)}
                    title="Pointer Mode (V)"
                >
                    <MousePointer2 className="h-4 w-4" />
                </div>

                {/* Hand Mode */}
                <div
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${controlMode === ControlMode.Hand
                        ? 'bg-state-accent-active text-text-accent'
                        : 'hover:bg-state-base-hover hover:text-text-secondary'
                        } `}
                    onClick={() => setControlMode(ControlMode.Hand)}
                    title="Hand Mode (H)"
                >
                    <Hand className="h-4 w-4" />
                </div>
            </div>

            {/* Add Block Button */}
            <div className="relative" ref={addBlockRef}>
                <div className="pointer-events-auto flex flex-col items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 text-text-tertiary shadow-lg">
                    <div
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${showAddBlock
                            ? 'bg-state-accent-active text-text-accent'
                            : 'hover:bg-state-base-hover hover:text-text-secondary'
                            } `}
                        onClick={() => setShowAddBlock(!showAddBlock)}
                        title="Add Block"
                    >
                        <Plus className="h-4 w-4" />
                    </div>
                </div>

                {/* Block Selector Popup */}
                {showAddBlock && (
                    <div className="pointer-events-auto absolute left-full top-0 ml-2 z-50">
                        <BlockSelector onSelect={handleAddBlock} onClose={() => setShowAddBlock(false)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasControl;
