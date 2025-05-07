import { useSelection } from '@/contexts/SelectionContext';
import { useBlockSelection } from '@/hooks/useBlockSelection';
import { ComponentType } from 'react';
import styles from './withSelectable.module.scss';

export function withSelectable<T extends { id: string }>(WrappedComponent: ComponentType<T>) {
  return function WithSelectable(props: T) {
    const { isSelected, selectRange, toggleSelection } = useBlockSelection();
    const { state } = useSelection();
    
    const handleMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (e.shiftKey) {
        e.preventDefault();
        if (state.selectedIds.length > 0) {
          const startId = state.selectedIds[0];
          selectRange(startId, props.id);
        }
      } else if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        toggleSelection(props.id);
      } else {
        if (!isSelected(props.id)) {
          toggleSelection(props.id);
        }
      }
    };
    
    return (
      <div 
        id={props.id}
        data-block-id={props.id}
        data-selecting={state.isSelecting}
        className={`${styles.selectable} ${isSelected(props.id) ? styles.selected : ''}`}
        style={{ pointerEvents: state.isSelecting ? 'none' : 'auto' }}
        onMouseDown={handleMouseDown}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}
