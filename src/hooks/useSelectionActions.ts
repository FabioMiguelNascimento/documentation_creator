"use client";

import { useBlocks } from '@/contexts/BlockContext';
import { useSelection } from '@/contexts/SelectionContext';
import { useCallback } from 'react';

export const useSelectionActions = () => {
  const { state, clearSelection } = useSelection();
  const { blocks, updateBlocks } = useBlocks();

  const deleteSelectedBlocks = useCallback(() => {
    if (state.selectedIds.length === 0) return;
    
    const focusedElement = document.activeElement;
    if (focusedElement?.matches('[contenteditable="true"]')) {
      const blockId = focusedElement.closest('[data-block-id]')?.getAttribute('data-block-id');
      if (blockId && state.selectedIds.includes(blockId)) {
        return;
      }
    }

    const remainingBlocks = blocks.filter(block => !state.selectedIds.includes(block.id));
    updateBlocks(remainingBlocks);
    clearSelection();
  }, [state.selectedIds, blocks, updateBlocks, clearSelection]);

  return {
    deleteSelectedBlocks
  };
};
