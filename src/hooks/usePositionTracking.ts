import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  top: number;
  left: number;
  transform: string;
}

interface UsePositionTrackingProps {
  show: boolean;
  initialX: number;
  onOutOfBounds?: (isOut: boolean) => void;
}

export function usePositionTracking({ show, initialX, onOutOfBounds }: UsePositionTrackingProps) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, transform: '' });
  const elementRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<Range | null>(null);

  const updatePosition = useCallback(() => {
    if (!elementRef.current || !show) return;
    
    const element = elementRef.current;
    const elementHeight = element.offsetHeight;
    const SPACING = 16;
    
    if (!rangeRef.current) {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        rangeRef.current = selection.getRangeAt(0);
      }
    }

    if (!rangeRef.current) return;

    const rect = rangeRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportTop = 0;
    
    const isOutside = rect.top < viewportTop || rect.bottom > viewportHeight;
    onOutOfBounds?.(isOutside);

    let top = rect.top;
    let transform = 'translate(-50%, -100%)';

    if (rect.top < elementHeight + SPACING) {
      top = rect.bottom + SPACING;
      transform = 'translateX(-50%)';
    }

    setPosition({
      left: initialX,
      top,
      transform,
    });
  }, [show, initialX, onOutOfBounds]);

  useEffect(() => {
    rangeRef.current = null;
  }, [initialX]);

  useEffect(() => {
    const update = () => requestAnimationFrame(updatePosition);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [updatePosition]);

  return { position, ref: elementRef };
}
