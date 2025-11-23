import React from 'react';
import { MousePointer2, Hand } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { ControlMode } from '../types/flow';

const CanvasControl: React.FC = () => {
    const { controlMode, setControlMode } = useFlowStore();

    return (
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center justify-center">
            <div className="pointer-events-auto flex flex-col items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 text-text-tertiary shadow-lg">
                {/* Pointer Mode */}
                <div
                    className={`mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${controlMode === ControlMode.Pointer
                            ? 'bg-state-accent-active text-text-accent'
                            : 'hover:bg-state-base-hover hover:text-text-secondary'
                        }`}
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
                        }`}
                    onClick={() => setControlMode(ControlMode.Hand)}
                    title="Hand Mode (H)"
                >
                    <Hand className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
};

export default CanvasControl;
