import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../stores/flowStore';
import VariableTrigger from './VariableTrigger';
import EnvItem from './EnvItem';
import VariableModal from './VariableModal';
import type { EnvironmentVariable } from '../types/flow';

const EnvPanel: React.FC = () => {
    const { showEnvPanel, setShowEnvPanel, environmentVariables, setEnvironmentVariables, envSecrets, setEnvSecrets } = useFlowStore();
    const [editingVar, setEditingVar] = useState<EnvironmentVariable | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!showEnvPanel) return null;

    const handleClose = () => {
        setShowEnvPanel(false);
    };

    const handleEdit = (variable: EnvironmentVariable) => {
        setEditingVar(variable);
        setIsEditModalOpen(true);
    };

    const handleDelete = (variable: EnvironmentVariable) => {
        const newVars = environmentVariables.filter(v => v.key !== variable.key);
        setEnvironmentVariables(newVars);

        if (variable.isSecret) {
            const newSecrets = { ...envSecrets };
            delete newSecrets[variable.key];
            setEnvSecrets(newSecrets);
        }
    };

    return (
        <div className="absolute right-0 top-0 z-40 h-full w-[420px] rounded-l-2xl border-l border-components-panel-border bg-components-panel-bg-alt shadow-xl transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-components-panel-border p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">Environment Variables</h2>
                        <p className="text-xs text-text-tertiary">Manage global variables for your workflow</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1 text-text-tertiary hover:bg-state-base-hover hover:text-text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4">
                        <VariableTrigger />
                    </div>

                    <div className="space-y-2">
                        {environmentVariables.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <p className="text-sm text-text-tertiary">No environment variables yet</p>
                            </div>
                        ) : (
                            environmentVariables.map((variable) => (
                                <EnvItem
                                    key={variable.key}
                                    variable={variable}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <VariableModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingVar(null);
                }}
                initialData={editingVar}
            />
        </div>
    );
};

export default EnvPanel;