import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Package, Database, Server, Cloud, Box, Layers, Cpu, Globe, Layout, Terminal } from 'lucide-react';
import useSWR from 'swr';
import FlowCanvas from '../components/FlowCanvas';
import Sidebar from '../components/Sidebar';
import PropertyPanel from '../components/PropertyPanel';
import TasksPanel from '../components/workflow/TasksPanel';
import { fetchApp, fetchAppComponents } from '../api/apps';
import { useFlowStore } from '../stores/flowStore';
import { componentsToNodes } from '../utils/componentToNode';
import GameIcon from '../assets/game.svg';

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

const WorkflowPage: React.FC = () => {
    const { appId } = useParams<{ appId: string }>();
    const navigate = useNavigate();
    const [showArrow, setShowArrow] = useState(false);
    const { setNodes, setEdges, clearNodes } = useFlowStore();
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeMenu, setActiveMenu] = useState<'arrangement' | 'tasks'>('arrangement');

    // Fetch app details
    const { data: app, isLoading, mutate: mutateApp } = useSWR(
        appId ? ['app', appId] : null,
        ([, id]) => fetchApp(id)
    );

    // Fetch app components
    const { data: components, mutate: mutateComponents } = useSWR(
        appId ? ['components', appId] : null,
        ([, id]) => fetchAppComponents(id)
    );

    // Initialize nodes when components are loaded
    useEffect(() => {
        if (components) {
            const nodes = componentsToNodes(components);
            setNodes(nodes);
        }

        // Cleanup: clear nodes when leaving the page
        return () => {
            clearNodes();
        };
    }, [components, setNodes, clearNodes]);

    const refreshWorkflowData = async () => {
        if (!appId) return;
        setEdges([]);
        await Promise.all([mutateApp(), mutateComponents()]);
        setRefreshKey((k) => k + 1);
    };

    // Use app icon or default game.svg icon
    const displayIcon = app?.icon || GameIcon;

    const handleArrowClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(-1);
    };

    const renderIcon = () => {
        if (showArrow) {
            return (
                <div
                    onClick={handleArrowClick}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <ArrowLeft style={{ width: '16px', height: '16px', color: '#155EEF' }} />
                </div>
            );
        }

        if (app?.icon && AVAILABLE_ICONS[app.icon]) {
            const IconComponent = AVAILABLE_ICONS[app.icon];
            return <IconComponent size={16} color="#155EEF" />;
        }

        if (typeof displayIcon === 'string') {
            return <img src={displayIcon} alt="App icon" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />;
        }

        return <img src={GameIcon} alt="App icon" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />;
    };

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header
                style={{
                    height: '60px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 24px',
                    background: '#fff',
                    zIndex: 10,
                }}
            >
                {isLoading ? (
                    <div className="animate-pulse h-8 w-48 bg-gray-200 rounded-lg" />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={() => {
                            setShowArrow(true);
                        }}
                        onMouseLeave={() => {
                            setShowArrow(false);
                        }}
                    >
                        {renderIcon()}
                        <span style={{ fontSize: '14px', color: '#64748b' }}>/</span>
                        <span style={{ fontSize: '14px', fontWeight: 400, color: '#155EEF' }}>
                            {app?.name || 'KubeMin Console'}
                        </span>
                        <ChevronDown style={{ width: '16px', height: '16px', color: '#155EEF' }} />
                    </div>
                )}
            </header>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Sidebar onSaved={refreshWorkflowData} activeMenu={activeMenu} onMenuSelect={setActiveMenu} />
                <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {activeMenu === 'arrangement' ? (
                        <>
                            <FlowCanvas appId={appId} app={app} refreshKey={refreshKey} onSaved={refreshWorkflowData} />
                            <PropertyPanel />
                        </>
                    ) : (
                        appId && <TasksPanel appId={appId} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default WorkflowPage;
