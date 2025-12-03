import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import type { EnvironmentVariable } from '../../types/flow';
import { cn } from '../../utils/cn';

interface EnvModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (variable: EnvironmentVariable) => void;
    editingVariable?: EnvironmentVariable | null;
}

const EnvModal: React.FC<EnvModalProps> = ({ isOpen, onClose, onSave, editingVariable }) => {
    const [type, setType] = useState<'String' | 'Number' | 'Secret'>('String');
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (editingVariable) {
            setType(editingVariable.type || 'String');
            setName(editingVariable.key);
            setValue(editingVariable.value);
            setDescription(editingVariable.description || '');
        } else {
            setType('String');
            setName('');
            setValue('');
            setDescription('');
        }
    }, [editingVariable, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;

        const variable: EnvironmentVariable = {
            key: name.trim(),
            value: value.trim(),
            type,
            isSecret: type === 'Secret',
            description: description.trim() || undefined,
        };

        onSave(variable);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="fixed inset-0 bg-black/20" onClick={handleCancel} />
            <div
                className="relative bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-hidden flex flex-col"
                style={{
                    marginTop: '120px', // 86px + 20px
                    marginRight: 'calc(400px + 16px + 20px)' // Component panel width + gap + right margin
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-components-panel-border">
                    <h2 className="text-[15px] font-semibold text-text-primary">
                        {editingVariable ? '编辑环境变量' : '添加环境变量'}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-1 rounded hover:bg-state-base-hover text-text-tertiary hover:text-text-primary"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Type Selection */}
                    <div>
                        <label className="mb-2 block text-[13px] font-medium text-text-primary">
                            类型
                        </label>
                        <div className="flex gap-2">
                            {(['String', 'Number', 'Secret'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "px-4 py-2 rounded-md text-[13px] font-medium transition-colors",
                                        type === t
                                            ? "bg-state-accent-active text-state-accent-solid border-2 border-state-accent-solid"
                                            : "bg-white border border-components-panel-border text-text-primary hover:bg-state-base-hover"
                                    )}
                                >
                                    {t}
                                    {t === 'Secret' && (
                                        <HelpCircle className="inline-block ml-1 h-3 w-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-[13px] font-medium text-text-primary">
                            名称
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="变量名"
                            className="w-full px-3 py-2 rounded-lg border border-components-panel-border bg-white text-[13px] text-text-primary outline-none input-gradient-focus focus:ring-0"
                            disabled={!!editingVariable}
                        />
                    </div>

                    {/* Value */}
                    <div>
                        <label className="mb-2 block text-[13px] font-medium text-text-primary">
                            值
                        </label>
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="变量值"
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-components-panel-border bg-white text-[13px] text-text-primary outline-none input-gradient-focus focus:ring-0 resize-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-[13px] font-medium text-text-primary">
                            描述
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="变量的描述"
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-components-panel-border bg-white text-[13px] text-text-primary outline-none input-gradient-focus focus:ring-0 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-components-panel-border">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg border border-components-button-secondary-border bg-white text-[13px] font-medium text-text-primary hover:bg-state-base-hover transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-components-button-primary-bg text-[13px] font-medium text-components-button-primary-text hover:bg-components-button-primary-hover transition-colors"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnvModal;

