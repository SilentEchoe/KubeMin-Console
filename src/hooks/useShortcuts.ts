import { useEffect } from 'react';
import { useFlowStore } from '../stores/flowStore';
import { isEventTargetInputArea } from '../utils/keyboard';

export const useShortcuts = () => {
    const { deleteSelectedElements, copyNode, pasteNode } = useFlowStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isEventTargetInputArea(e.target as HTMLElement)) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelectedElements();
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
                e.preventDefault();
                copyNode();
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                e.preventDefault();
                pasteNode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [deleteSelectedElements, copyNode, pasteNode]);
};
