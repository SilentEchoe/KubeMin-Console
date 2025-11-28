import React, { useRef, useEffect, useState } from 'react';
import { useFlowStore } from '../stores/flowStore';
import { Plus, FileText, Play, Clipboard, Download, Upload, ChevronRight, Settings } from 'lucide-react';
import BlockSelector from './BlockSelector';

const PanelContextMenu: React.FC = () => {
    const { panelMenu, setPanelMenu, addNode, nodes } = useFlowStore();
    const ref = useRef<HTMLDivElement>(null);
    const [showAddBlock, setShowAddBlock] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleAddBlock = (type: string, data?: any) => {
        if (type === 'template' && Array.isArray(data)) {
            data.forEach((comp: any, index: number) => {
                const id = Math.random().toString(36).substr(2, 9);

                // Map properties (ports)
                const properties = comp.properties?.ports?.map((p: any) => ({
                    id: `prop-${Math.random().toString(36).substr(2, 9)}`,
                    value: p.port.toString()
                })) || [];

                // Map env
                let envConfig = comp.properties?.env ? Object.entries(comp.properties.env).map(([key, value]) => ({
                    id: `env-${Math.random().toString(36).substr(2, 9)}`,
                    key,
                    value: String(value)
                })) : [];

                let componentType = (comp.type as any) || 'webservice';
                let environmentVariables: any[] = [];

                // Handle config/secret types
                if (comp.type === 'config' || comp.type === 'secret') {
                    componentType = 'config-secret';

                    // Map conf properties
                    if (comp.properties?.conf) {
                        Object.entries(comp.properties.conf).forEach(([key, value]) => {
                            environmentVariables.push({
                                key,
                                value: String(value),
                                isSecret: false,
                                description: 'Imported config'
                            });
                        });
                    }

                    // Map secret properties
                    if (comp.properties?.secret) {
                        Object.entries(comp.properties.secret).forEach(([key, value]) => {
                            environmentVariables.push({
                                key,
                                value: String(value),
                                isSecret: true,
                                description: 'Imported secret'
                            });
                        });
                    }
                }

                addNode({
                    id,
                    type: 'custom',
                    position: { x: panelMenu.left + (index * 50), y: panelMenu.top + (index * 50) },
                    data: {
                        label: comp.name || 'Component',
                        description: comp.description || `Imported ${comp.type}`,
                        icon: componentType === 'config-secret' ? 'settings' : 'box',
                        componentType,
                        image: comp.properties?.image || '',
                        replicas: comp.replicas || 1,
                        properties,
                        envConfig,
                        environmentVariables, // Add populated environment variables
                        traits: comp.traits || {}
                    },
                });
            });
            setPanelMenu(null);
            return;
        }

        const id = Math.random().toString(36).substr(2, 9);
        addNode({
            id,
            type: 'custom',
            position: { x: panelMenu.left + 50, y: panelMenu.top + 50 }, // Offset slightly
            data: {
                label: type.toUpperCase(),
                description: `New ${type} node`,
                icon: 'box',
                componentType: type === 'component' ? 'webservice' : (type as any),
            },
        });
        setPanelMenu(null);
    };

    const handleExportDSL = () => {
        const components = nodes
            .map(node => {
                const ports = node.data.properties?.map(p => ({ port: parseInt(p.value) || 0 })) || [];
                const env = node.data.envConfig?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}) || {};

                return {
                    name: node.data.label || 'component',
                    type: node.data.componentType || 'webservice',
                    replicas: node.data.replicas || 1,
                    image: node.data.image || 'nginx:latest',
                    properties: {
                        ports: ports,
                        env: env
                    }
                };
            });

        const dsl = {
            name: "project-export", // Placeholder
            alias: "project",
            version: "1.0.0",
            project: "",
            description: "Exported Project",
            component: components
        };

        const blob = new Blob([JSON.stringify(dsl, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dsl.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setPanelMenu(null);
    };

    const handleImportDSL = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const dsl = JSON.parse(content);

                if (dsl.component && Array.isArray(dsl.component)) {
                    dsl.component.forEach((comp: any, index: number) => {
                        const id = Math.random().toString(36).substr(2, 9);

                        // Map properties
                        const properties = comp.properties?.ports?.map((p: any) => ({
                            id: `prop-${Math.random().toString(36).substr(2, 9)}`,
                            value: p.port.toString()
                        })) || [];

                        // Map env
                        const envConfig = comp.properties?.env ? Object.entries(comp.properties.env).map(([key, value]) => ({
                            id: `env-${Math.random().toString(36).substr(2, 9)}`,
                            key,
                            value: String(value)
                        })) : [];

                        addNode({
                            id,
                            type: 'custom',
                            position: { x: panelMenu.left + (index * 50), y: panelMenu.top + (index * 50) },
                            data: {
                                label: comp.name || 'Component',
                                description: 'Imported component',
                                icon: 'box',
                                componentType: comp.type || 'webservice',
                                image: comp.image,
                                replicas: comp.replicas,
                                properties,
                                envConfig
                            },
                        });
                    });
                }
            } catch (error) {
                console.error('Failed to import DSL:', error);
                alert('Invalid DSL file');
            }
        };
        reader.readAsText(file);
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
                {/* Create Config/Secret Node */}
                <div
                    className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
                    onClick={() => {
                        const id = Math.random().toString(36).substr(2, 9);
                        addNode({
                            id,
                            type: 'custom',
                            position: { x: panelMenu.left + 50, y: panelMenu.top + 50 },
                            data: {
                                label: 'Config/Secret',
                                description: 'Manage global environment variables',
                                icon: 'settings',
                                componentType: 'config-secret',
                            },
                        });
                        setPanelMenu(null);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Config/Secret Node</span>
                    </div>
                </div>
            </div>

            <div className="my-1 h-[0.5px] bg-components-panel-border" />

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
                <div
                    className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
                    onClick={handleExportDSL}
                >
                    <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </div>
                </div>

                {/* Import DSL */}
                <div
                    className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-state-base-hover"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Import DSL</span>
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleImportDSL}
                />
            </div>

        </div>
    );
};

export default PanelContextMenu;
