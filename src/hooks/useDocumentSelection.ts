import { useCallback, useState } from 'react';

export const useDocumentSelection = () => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev);
    setSelectedDocs([]);
  }, []);

  const selectAll = useCallback((docIds: string[]) => {
    setSelectedDocs(prev => 
      prev.length === docIds.length ? [] : docIds
    );
  }, []);

  const toggleSelection = useCallback((docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  }, []);

  return {
    isSelectionMode,
    selectedDocs,
    toggleSelectionMode,
    selectAll,
    toggleSelection
  };
};
