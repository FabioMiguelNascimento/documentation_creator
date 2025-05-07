"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface SelectionState {
  selectedIds: string[];
  isSelecting: boolean;
  startPoint: { x: number; y: number } | null;
  endPoint: { x: number; y: number } | null;
  history: string[][];
  historyIndex: number;
}

interface SelectionContextType {
  state: SelectionState;
  selectBlocks: (ids: string[]) => void;
  startSelection: (x: number, y: number, e: React.MouseEvent) => void;
  updateSelection: (x: number, y: number) => void;
  endSelection: () => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionState>(() => ({
    selectedIds: [],
    isSelecting: false,
    startPoint: null,
    endPoint: null,
    history: [],
    historyIndex: -1
  }));

  const lastUpdateRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const selectBlocks = (ids: string[]) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      return {
        ...prev,
        selectedIds: ids,
        history: [...newHistory, ids],
        historyIndex: prev.historyIndex + 1
      };
    });
  };

  const updateSelection = useCallback((x: number, y: number) => {
    if (!state.isSelecting) return;

    if (
      lastUpdateRef.current.x === x && 
      lastUpdateRef.current.y === y
    ) {
      return;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      lastUpdateRef.current = { x, y };
      setState(prev => ({ ...prev, endPoint: { x, y } }));
    });
  }, [state.isSelecting]);

  const startSelection = useCallback((x: number, y: number, e: React.MouseEvent) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey || 
        (e.target as HTMLElement).closest('[contenteditable="true"], .ProseMirror, pre[contenteditable="true"]')) {
      return;
    }

    window.getSelection()?.removeAllRanges();
    setState(prev => ({ 
      ...prev, 
      isSelecting: true,
      selectedIds: [],
      startPoint: { x, y }, 
      endPoint: { x, y } 
    }));
  }, []);

  const endSelection = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setState(prev => ({
      ...prev,
      isSelecting: false,
      startPoint: null,
      endPoint: null
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIds: [],
      isSelecting: false,
      startPoint: null,
      endPoint: null
    }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex <= 0) return prev;
      
      return {
        ...prev,
        selectedIds: prev.history[prev.historyIndex - 1],
        historyIndex: prev.historyIndex - 1
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      
      return {
        ...prev,
        selectedIds: prev.history[prev.historyIndex + 1],
        historyIndex: prev.historyIndex + 1
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.selectedIds.length === 0) return;

      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        e.stopPropagation();

        const event = new CustomEvent('moveSelectedBlocks', {
          detail: { 
            ids: state.selectedIds,
            direction: e.key === 'ArrowUp' ? 'up' : 'down'
          }
        });
        document.dispatchEvent(event);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && state.selectedIds.length > 0) {
        if (e.key === 'c') {
          e.preventDefault();
          const event = new CustomEvent('copySelectedBlocks', {
            detail: { ids: state.selectedIds }
          });
          document.dispatchEvent(event);
        } else if (e.key === 'v') {
          e.preventDefault();
          const event = new CustomEvent('pasteBlocks');
          document.dispatchEvent(event);
        }
      } else if (e.key === 'Escape') {
        clearSelection();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedIds.length > 0) {
        if (document.activeElement?.matches('[contenteditable="true"], .ProseMirror, pre[contenteditable="true"]')) {
          return;
        }
        e.preventDefault();
        const event = new CustomEvent('deleteSelectedBlocks', {
          detail: { ids: state.selectedIds }
        });
        document.dispatchEvent(event);
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, undo, redo, state.selectedIds]);

  useEffect(() => {
    if (state.selectedIds.length > 0) {
      localStorage.setItem('selection-state', JSON.stringify(state));
    } else {
      localStorage.removeItem('selection-state');
    }
  }, [state.selectedIds]);

  return (
    <SelectionContext.Provider value={{ 
      state, 
      selectBlocks, 
      startSelection, 
      updateSelection, 
      endSelection,
      clearSelection,
      undo,
      redo
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSelection must be used within SelectionProvider');
  return context;
};
