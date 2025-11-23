import React, { useState } from 'react';
import { cn } from '../utils/cn';
import type { EnvironmentVariable } from '../types/flow';

interface EnvironmentVariableManagerProps {
    variables: EnvironmentVariable[];
    onChange: (variables: EnvironmentVariable[]) => void;
}

const EnvironmentVariableManager: React.FC<EnvironmentVariableManagerProps> = ({
    variables,
    onChange
}) => {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editKey, setEditKey] = useState('');
    const [editValue, setEditValue] = useState('');
    const [editIsSecret, setEditIsSecret] = useState(false);

    const addVariable = () => {
        if (newKey.trim() && newValue.trim()) {
            // 检查是否已存在相同的 key
            const exists = variables.some(v => v.key === newKey.trim());
            if (exists) {
                alert('变量名已存在');
                return;
            }

            onChange([...variables, {
                key: newKey.trim(),
                value: newValue.trim(),
                isSecret
            }]);
            setNewKey('');
            setNewValue('');
            setIsSecret(false);
        }
    };

    const removeVariable = (index: number) => {
        onChange(variables.filter((_, i) => i !== index));
    };

    const startEdit = (index: number) => {
        setEditingIndex(index);
        setEditKey(variables[index].key);
        setEditValue(variables[index].value);
        setEditIsSecret(variables[index].isSecret || false);
    };

    const saveEdit = () => {
        if (editKey.trim() && editValue.trim() && editingIndex !== null) {
            // 检查是否与其他变量冲突（排除正在编辑的变量）
            const exists = variables.some((v, i) => i !== editingIndex && v.key === editKey.trim());
            if (exists) {
                alert('变量名已存在');
                return;
            }

            const newVariables = [...variables];
            newVariables[editingIndex] = {
                key: editKey.trim(),
                value: editValue.trim(),
                isSecret: editIsSecret
            };
            onChange(newVariables);
            setEditingIndex(null);
            setEditKey('');
            setEditValue('');
            setEditIsSecret(false);
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditKey('');
        setEditValue('');
        setEditIsSecret(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'save') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (action === 'add') {
                addVariable();
            } else {
                saveEdit();
            }
        }
    };

    return (
        <div className="space-y-3">
            {/* 添加新变量表单 */}
            <div className="space-y-2 p-3 bg-components-panel-bg rounded-lg border border-components-panel-border">
                <div className="text-sm font-medium text-text-secondary">添加环境变量</div>
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="变量名 (例如: DATABASE_URL)"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'add')}
                        className="w-full px-3 py-2 text-sm border border-components-panel-border rounded-md bg-white focus:border-state-accent-solid focus:ring-1 focus:ring-state-accent-solid outline-none"
                    />
                    <div className="flex gap-2">
                        <textarea
                            placeholder="变量值（支持多行文本）"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            rows={3}
                            className="flex-1 px-3 py-2 text-sm border border-components-panel-border rounded-md bg-white focus:border-state-accent-solid focus:ring-1 focus:ring-state-accent-solid outline-none resize-vertical min-h-[60px] max-h-[200px]"
                        />
                        <label className="flex items-center gap-1 px-2 py-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isSecret}
                                onChange={(e) => setIsSecret(e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-text-secondary">密文</span>
                        </label>
                    </div>
                    <button
                        onClick={addVariable}
                        disabled={!newKey.trim() || !newValue.trim()}
                        className="px-4 py-2 text-sm bg-state-accent-solid text-white rounded-md hover:bg-state-accent-solid-hover disabled:bg-state-accent-disabled disabled:cursor-not-allowed transition-colors"
                    >
                        添加变量
                    </button>
                </div>
            </div>

            {/* 现有变量列表 */}
            {variables.length > 0 && (
                <div className="space-y-2">
                    <div className="text-sm font-medium text-text-secondary">
                        环境变量列表 ({variables.length})
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {variables.map((variable, index) => (
                            <div key={index} className="group border border-components-panel-border rounded-lg bg-white hover:bg-state-base-hover transition-colors">
                                {editingIndex === index ? (
                                    /* 编辑模式 */
                                    <div className="p-3 space-y-2">
                                        <input
                                            type="text"
                                            value={editKey}
                                            onChange={(e) => setEditKey(e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-components-panel-border rounded focus:border-state-accent-solid focus:ring-1 focus:ring-state-accent-solid outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <textarea
                                                placeholder="变量值（支持多行文本）"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                rows={3}
                                                className="flex-1 px-2 py-1 text-sm border border-components-panel-border rounded focus:border-state-accent-solid focus:ring-1 focus:ring-state-accent-solid outline-none resize-vertical min-h-[60px] max-h-[150px]"
                                            />
                                            <label className="flex items-center gap-1 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={editIsSecret}
                                                    onChange={(e) => setEditIsSecret(e.target.checked)}
                                                />
                                                密文
                                            </label>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveEdit}
                                                className="px-3 py-1 text-xs bg-state-accent-solid text-white rounded hover:bg-state-accent-solid-hover transition-colors"
                                            >
                                                保存
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1 text-xs bg-components-badge-bg-dimm text-text-secondary rounded hover:bg-state-base-hover transition-colors"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* 显示模式 - 使用您提到的 flex items-center justify-between 布局 */
                                    <div className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex grow items-center gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="system-sm-medium text-text-primary truncate">
                                                        {variable.key}
                                                    </div>
                                                    <div className="system-xs-regular text-text-tertiary mt-0.5">
                                                        {variable.isSecret ? '••••••••' : variable.value}
                                                    </div>
                                                </div>
                                                {variable.isSecret && (
                                                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                                        密文
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(index)}
                                                    className="p-1 text-text-tertiary hover:text-text-secondary hover:bg-state-base-hover rounded transition-colors"
                                                    title="编辑"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`确定要删除变量 "${variable.key}" 吗？`)) {
                                                            removeVariable(index);
                                                        }
                                                    }}
                                                    className="p-1 text-text-tertiary hover:text-text-destructive hover:bg-state-destructive-hover rounded transition-colors"
                                                    title="删除"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {variables.length === 0 && (
                <div className="text-center py-8 text-text-tertiary">
                    <div className="text-sm">暂无环境变量</div>
                    <div className="text-xs mt-1">使用上方表单添加环境变量</div>
                </div>
            )}
        </div>
    );
};

export default EnvironmentVariableManager;