import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { cn } from '../utils/cn';

const PANEL_CONTAINER_STYLES = 'absolute top-[70px] right-5 bottom-5 flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl z-20 transition-all duration-200';
const PANEL_HEADER_STYLES = 'flex items-center justify-between border-b border-components-panel-border px-5 py-4';
const PANEL_TITLE_STYLES = 'text-base font-semibold text-text-primary';
const PANEL_CLOSE_BUTTON_STYLES = 'flex items-center justify-center rounded-md p-1 text-text-secondary hover:bg-state-base-hover transition-colors';
const PANEL_CONTENT_STYLES = 'flex-1 overflow-y-auto p-4';
const LABEL_STYLES = 'mb-1 block text-xs font-medium text-text-tertiary uppercase';
const INPUT_CONTAINER_STYLES = 'rounded-lg border border-components-panel-border bg-components-badge-bg-dimm p-2 hover:bg-state-base-hover transition-colors cursor-pointer';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, setSelectedNode, updateNodeData } = useFlowStore();

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }

    return (
        <div
            className={PANEL_CONTAINER_STYLES}
            style={{
                minWidth: '400px',
                maxWidth: '720px',
                width: '400px', // Default width, could be dynamic
            }}
        >
            {/* Header */}
            <div className={PANEL_HEADER_STYLES}>
                <div className={PANEL_TITLE_STYLES}>
                    Component Set
                </div>
                <button
                    onClick={() => setSelectedNode(null)}
                    className={PANEL_CLOSE_BUTTON_STYLES}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className={PANEL_CONTENT_STYLES}>
                {/* Component Type Selection */}
                <div className="mb-4">
                    <label className={LABEL_STYLES}>
                        Component Type
                    </label>
                    <div className="relative">
                        <select
                            className={cn(INPUT_CONTAINER_STYLES, "w-full appearance-none flex items-center justify-between outline-none focus:ring-1 focus:ring-state-accent-solid")}
                            value={selectedNode.data.componentType || 'webservice'}
                            onChange={(e) => {
                                updateNodeData(selectedNode.id, { componentType: e.target.value });
                            }}
                        >
                            <option value="webservice">webservice</option>
                            <option value="store">store</option>
                            <option value="config">config</option>
                            <option value="secret">secret</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary pointer-events-none" />
                    </div>
                </div>

                {/* Context */}
                <div className="mb-4">
                    <label className={LABEL_STYLES}>
                        Context
                    </label>
                    <div className="rounded-lg border border-dashed border-gray-300 p-2 text-center hover:bg-state-base-hover cursor-pointer transition-colors">
                        <span className="text-xs text-text-secondary">Add Context</span>
                    </div>
                </div>

                {/* System Prompt */}
                <div className="mb-4">
                    <label className={LABEL_STYLES}>
                        System Prompt
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full rounded-lg border border-components-panel-border bg-components-badge-bg-dimm p-3 text-sm text-text-primary outline-none focus:border-state-accent-solid focus:ring-1 focus:ring-state-accent-solid min-h-[200px] resize-none"
                            placeholder="You are a helpful assistant..."
                            defaultValue={selectedNode.data.description || ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;
