"use client";

import { useSelection } from '@/contexts/SelectionContext';
import { useCallback, useEffect, useRef } from 'react';
import styles from './SelectionPane.module.scss';

export function SelectionPane() {
  const { state, selectBlocks } = useSelection();
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef({ ids: [] as string[] });

  const updateSelectedBlocks = useCallback(() => {
    if (!state.startPoint || !state.endPoint) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const selectionRect = {
        left: Math.min(state.startPoint.x, state.endPoint.x),
        top: Math.min(state.startPoint.y, state.endPoint.y),
        right: Math.max(state.startPoint.x, state.endPoint.x),
        bottom: Math.max(state.startPoint.y, state.endPoint.y)
      };

      const blocks = document.querySelectorAll('[data-block-id]');
      const selectedIds = Array.from(blocks)
        .reduce((acc: string[], block) => {
          const rect = block.getBoundingClientRect();
          if (!(rect.right < selectionRect.left || 
              rect.left > selectionRect.right || 
              rect.bottom < selectionRect.top || 
              rect.top > selectionRect.bottom)) {
            const id = block.getAttribute('data-block-id');
            if (id) acc.push(id);
          }
          return acc;
        }, []);

      if (JSON.stringify(selectedIds) !== JSON.stringify(lastUpdateRef.current.ids)) {
        lastUpdateRef.current.ids = selectedIds;
        selectBlocks(selectedIds);
      }
    });
  }, [state.startPoint, state.endPoint, selectBlocks]);

  useEffect(() => {
    if (state.isSelecting) {
      updateSelectedBlocks();
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [state.isSelecting, state.endPoint?.x, state.endPoint?.y, updateSelectedBlocks]);

  if (!state.isSelecting || !state.startPoint || !state.endPoint) {
    return null;
  }

  const width = Math.abs(state.endPoint.x - state.startPoint.x);
  const height = Math.abs(state.endPoint.y - state.startPoint.y);

  if (width < 5 && height < 5) {
    return null;
  }

  const style = {
    left: Math.min(state.startPoint.x, state.endPoint.x),
    top: Math.min(state.startPoint.y, state.endPoint.y),
    width,
    height,
  };

  return <div className={styles.selectionBox} style={style} />;
}
