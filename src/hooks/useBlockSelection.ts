"use client";

import { useSelection } from '@/contexts/SelectionContext';
import { useCallback } from 'react';

export const useBlockSelection = () => {
  const { state, selectBlocks, clearSelection } = useSelection();

  const debugBlockElements = () => {
    const elements = Array.from(document.querySelectorAll('[id^="block-"]'));
    console.log('Found blocks:', elements.map(el => ({
      id: el.getAttribute('id'),
      element: el
    })));
  };

  const selectRange = useCallback((startId: string, endId: string) => {
    const elements = Array.from(document.querySelectorAll('[id^="block-"]'));
    console.log('Selection attempt:', { startId, endId, elements });
    const blockIds = elements.map(el => el.getAttribute('id')!);
    
    const startIndex = blockIds.indexOf(startId);
    const endIndex = blockIds.indexOf(endId);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    const selectedIds = blockIds.slice(start, end + 1);
    selectBlocks(selectedIds);
  }, [selectBlocks]);

  const toggleSelection = useCallback((id: string) => {
    selectBlocks(
      state.selectedIds.includes(id)
        ? state.selectedIds.filter(blockId => blockId !== id)
        : [...state.selectedIds, id]
    );
  }, [state.selectedIds, selectBlocks]);

  return {
    selectedIds: state.selectedIds,
    isSelected: (id: string) => state.selectedIds.includes(id),
    selectRange,
    toggleSelection,
    clearSelection,
    debugBlockElements
  };
};
