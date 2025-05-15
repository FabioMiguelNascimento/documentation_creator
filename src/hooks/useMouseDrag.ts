"use client";

import { useCallback, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useMouseDrag() {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentPos, setCurrentPos] = useState<Position | null>(null);

  const startDrag = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).matches('[contenteditable="true"]')) {
      return;
    }
    
    setIsDragging(true);
    const position = { x: e.clientX, y: e.clientY };
    setStartPos(position);
    setCurrentPos(position);
  }, []);

  const updateDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  }, [isDragging]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setStartPos(null);
    setCurrentPos(null);
  }, []);

  return {
    isDragging,
    startPos,
    currentPos,
    startDrag,
    updateDrag,
    endDrag
  };
}
