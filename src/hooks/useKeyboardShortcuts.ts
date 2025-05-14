import { useEffect } from 'react';
import { useDocumentSelection } from './useDocumentSelection';

export const useKeyboardShortcuts = () => {
  const { isSelectionMode, toggleSelection } = useDocumentSelection();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.key === ' ' || e.key === 'Enter') && isSelectionMode) {
        e.preventDefault();
        const focusedElement = document.activeElement;
        const docId = focusedElement?.getAttribute('data-doc-id');
        if (docId) {
          toggleSelection(docId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isSelectionMode, toggleSelection]);
};
