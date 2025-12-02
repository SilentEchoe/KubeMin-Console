import React from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import { cn } from '../utils/cn';
import EnvPanel from './EnvPanel';
import ComponentSetMenu from './workflow/ComponentSetMenu';
import { Button } from './ui/Button';
import TraitsPanel from './TraitsPanel';

const PANEL_CONTAINER_STYLES = 'absolute top-[70px] right-5 bottom-5 flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-white shadow-2xl z-20 transition-all duration-200';
const PANEL_TITLE_STYLES = 'text-[15px] font-semibold text-text-primary';
const PANEL_CONTENT_STYLES = 'flex-1 overflow-y-auto p-4';

export type ComponentSetSectionKey = 'system' | 'user' | 'memory' | 'vision' | 'resolution';

const PropertyPanel: React.FC = () => {
    const { nodes, selectedNodeId, updateNodeData } = useFlowStore();
    const [showConfigPanel, setShowConfigPanel] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState<ComponentSetSectionKey>('system');

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) {
        return null;
    }

    if ((selectedNode.data.componentType as any) === 'config-secret') {
        return <EnvPanel
            variables={selectedNode.data.environmentVariables || []}
            onUpdate={(vars) => updateNodeData(selectedNode.id, { environmentVariables: vars })}
        />;
    }

    return (
        <>
            {/* Floating Configuration Panel */}
            {showConfigPanel && (
                <div
                    className={cn(PANEL_CONTAINER_STYLES, "right-[440px]")}
                    style={{
                        minWidth: '400px',
                        maxWidth: '400px',
                        width: '400px',
                        height: 'auto',
                        maxHeight: 'calc(100vh - 100px)',
                    }}
                >
                    <div className="flex items-center justify-between border-b border-components-panel-border px-5 py-4">
                        <div className={PANEL_TITLE_STYLES}>Traits</div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowConfigPanel(false)}
                        >
                            <X size={20} />
                        </Button>
                    </div>
                    <div className={PANEL_CONTENT_STYLES}>
                        <TraitsPanel node={selectedNode} />
                    </div>
                </div>
            )}

            <div
                className={PANEL_CONTAINER_STYLES}
                style={{
                    minWidth: '400px',
                    maxWidth: '720px',
                    width: '400px', // Default width, could be dynamic
                }}
            >
                {/* Header with Tabs */}
                <div className="border-b border-components-panel-border">
                    <div className="flex items-center justify-between px-5 pt-4">
                        <div className="flex items-center gap-6">
                            <button className="text-[13px] font-medium text-text-primary pb-2.5 border-b-2 border-text-primary relative">
                                设置
                            </button>
                            <button className="text-[13px] font-medium text-text-tertiary pb-2.5 border-b-2 border-transparent hover:text-text-secondary transition-colors">
                                上次运行
                            </button>
                        </div>

                    </div>
                </div>

                {/* Content */}
                <div className={PANEL_CONTENT_STYLES}>
                    {/* Component Set 菜单栏（一比一复刻在内容顶部） */}
                    <div className="mb-4">
                        <ComponentSetMenu
                            activeKey={activeSection}
                            onChange={setActiveSection}
                        />
                    </div>

                    {/* Placeholder for other sections */}
                    {activeSection !== 'system' && (
                        <div className="mt-6 text-xs text-text-tertiary">
                            此区域对应菜单 “{activeSection.toUpperCase()}”，后续可按需填充具体表单配置。
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default PropertyPanel;
