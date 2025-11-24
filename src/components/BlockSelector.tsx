import React, { useState } from 'react';
import { Search, Box, Wrench } from 'lucide-react';

type TabKey = 'start' | 'blocks' | 'tools' | 'sources';

interface BlockSelectorProps {
    onSelect: (type: string) => void;
    onClose: () => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({ onSelect }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('blocks');
    const [search, setSearch] = useState('');

    const tabs: { key: TabKey; name: string }[] = [
        { key: 'start', name: 'Start' },
        { key: 'blocks', name: 'Blocks' },
        { key: 'tools', name: 'Tools' },
        { key: 'sources', name: 'Sources' },
    ];

    const blocks = [
        // { type: 'llm', title: 'LLM', category: 'Model' },
        { type: 'component', title: 'Component', category: 'Model' },
        // { type: 'knowledge', title: 'Knowledge Retrieval', category: 'Knowledge' },
        // { type: 'if-else', title: 'If/Else', category: 'Logic' },
        // { type: 'code', title: 'Code', category: 'Logic' },
        // { type: 'http', title: 'HTTP Request', category: 'Transform' },
        { type: 'config-secret', title: 'Config/Secret Node', category: 'Model' },
    ];

    return (
        <div className="w-[320px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="relative flex bg-background-section-burn pl-1 pt-1 border-b border-components-panel-border">
                {tabs.map((tab) => (
                    <div
                        key={tab.key}
                        className={`
                            system-sm-medium relative mr-0.5 flex h-8 items-center rounded-t-lg px-3 cursor-pointer text-xs font-medium
                            ${activeTab === tab.key
                                ? 'bg-components-panel-bg text-text-accent border-t border-x border-components-panel-border -mb-[1px] pb-[1px]'
                                : 'text-text-tertiary hover:text-text-secondary'
                            }
                        `}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.name}
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="p-2">
                <div className="relative flex items-center">
                    <Search className="absolute left-2 h-4 w-4 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search blocks..."
                        className="w-full rounded-lg bg-background-section-burn py-1.5 pl-8 pr-2 text-sm outline-none focus:ring-1 focus:ring-text-accent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 max-h-[300px]">
                {activeTab === 'blocks' && (
                    <div className="space-y-2">
                        <div className="text-xs font-medium text-text-tertiary px-2">Model</div>
                        {blocks.filter(b => b.category === 'Model').map(block => (
                            <div
                                key={block.type}
                                className="flex h-8 w-full cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover"
                                onClick={() => onSelect(block.type)}
                            >
                                <Box className="mr-2 h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">{block.title}</span>
                            </div>
                        ))}

                        <div className="text-xs font-medium text-text-tertiary px-2 mt-2">Other</div>
                        {blocks.filter(b => b.category === 'Other').map(block => (
                            <div
                                key={block.type}
                                className="flex h-8 w-full cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover"
                                onClick={() => onSelect(block.type)}
                            >
                                <Wrench className="mr-2 h-4 w-4 text-text-secondary" />
                                <span className="text-sm text-text-secondary">{block.title}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab !== 'blocks' && (
                    <div className="flex items-center justify-center h-20 text-sm text-text-tertiary">
                        Coming soon...
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockSelector;
