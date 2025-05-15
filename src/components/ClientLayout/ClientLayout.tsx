'use client';
import { useLayoutEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Navigation from '../Navigation/Navigation';

const STORAGE_KEY = 'nav-width';
const DEFAULT_WIDTH = 280;
const MIN_SIZE = 15;
const MAX_SIZE = 35;

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ flex: 1, position: 'relative' }}>
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
      <div style={{ display: 'flex' }}>
        <div style={{ width: DEFAULT_WIDTH }}>
          <Navigation />
        </div>
        <main style={{ flex: 1 }}>
          <MainContent>{children}</MainContent>
        </main>
      </div>
    );
  }

  return (
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
  );
};
