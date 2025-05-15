'use client';
import { SelectionPane } from '@/components/SelectionPane/SelectionPane';
import { SelectionProvider, useSelection } from '@/contexts/SelectionContext';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Navigation from '../Navigation/Navigation';

const STORAGE_KEY = 'nav-width';
const DEFAULT_WIDTH = 280;
const MIN_SIZE = 15;
const MAX_SIZE = 35;

function MainContent({ children }: { children: React.ReactNode }) {
  const { startSelection, updateSelection, endSelection } = useSelection();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateSelection(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      endSelection();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateSelection, endSelection]);

  return (
    <main 
      className="teste" 
      style={{ flex: 1, position: 'relative' }}
      onMouseDown={(e) => startSelection(e.clientX, e.clientY, e)}
    >
      <SelectionPane />
      {children}
    </main>
  );
}

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useLayoutEffect(() => {
    const savedWidth = Number(localStorage.getItem(STORAGE_KEY)) || DEFAULT_WIDTH;
    setWidth(savedWidth);
    setMounted(true);
  }, []);

  const handleLayout = (sizes: number[]) => {
    if (!mounted) return;
    const newWidth = Math.round((sizes[0] / 100) * window.innerWidth);
    localStorage.setItem(STORAGE_KEY, String(newWidth));
  };

  if (!mounted) {
    return (
      <SelectionProvider>
        <div style={{ display: 'flex' }}>
          <div style={{ width: DEFAULT_WIDTH }}>
            <Navigation />
          </div>
          <main style={{ flex: 1 }}>
            <MainContent>{children}</MainContent>
          </main>
        </div>
      </SelectionProvider>
    );
  }

  return (
    <SelectionProvider>
      <PanelGroup direction="horizontal" onLayout={handleLayout}>
        <Panel 
          defaultSize={MIN_SIZE}
          minSize={MIN_SIZE}
          maxSize={MAX_SIZE}
        >
          <Navigation />
        </Panel>
        <PanelResizeHandle className="panel-resize-handle" />
        <Panel>
          <MainContent>{children}</MainContent>
        </Panel>
      </PanelGroup>
    </SelectionProvider>
  );
};
