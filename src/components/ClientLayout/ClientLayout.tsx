'use client';
import { SelectionPane } from '@/components/SelectionPane/SelectionPane';
import { SelectionProvider, useSelection } from '@/contexts/SelectionContext';
import { useEffect } from 'react';
import Navigation from '../Navigation/Navigation';

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
  return (
    <SelectionProvider>
      <div style={{ display: 'flex' }}>
        <Navigation />
        <MainContent>{children}</MainContent>
      </div>
    </SelectionProvider>
  );
};
