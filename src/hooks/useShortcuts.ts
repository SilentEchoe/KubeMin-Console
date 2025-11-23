import { useEffect } from 'react';
import { useFlowStore } from '../stores/flowStore';
import { isEventTargetInputArea } from '../utils/keyboard';

export const useShortcuts = () => {
    const { deleteSelectedElements } = useFlowStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isEventTargetInputArea(e.target as HTMLElement)) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelectedElements();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [deleteSelectedElements]);
};
