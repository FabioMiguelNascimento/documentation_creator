import { Draggable } from "@hello-pangea/dnd";
import { KeyboardEvent, useRef, useState } from "react";
import styles from "./ListBlock.module.scss";

interface ListBlockProps {
  id: string;
  content: string;
  index: number;
  onChange: (id: string, content: string) => void;
  onEnter?: (id: string) => void;
  onDelete: (id: string) => void;
  onTransform?: (id: string, type: string, content: string) => void;
}

export default function ListBlock({
  id,
  content,
  index,
  onChange,
  onEnter,
  onDelete,
  onTransform
}: ListBlockProps) {
  const [items, setItems] = useState(content.split("\n").filter(Boolean));
  const listRef = useRef<HTMLUListElement>(null);

  const updateContent = (newItems: string[]) => {
    setItems(newItems);
    onChange(id, newItems.join("\n"));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, idx: number) => {
    const currentText = e.currentTarget.textContent || '';
    const isEmpty = !currentText.trim();

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (isEmpty && items.length === 1) {
        onTransform?.(id, 'text', '');
        return;
      }

      const newItems = [...items];
      newItems.splice(idx + 1, 0, '');
      updateContent(newItems);

      setTimeout(() => {
        const listItems = listRef.current?.children;
        if (listItems && listItems[idx + 1]) {
          const div = listItems[idx + 1].querySelector('[contenteditable]');
          div?.focus();
        }
      }, 0);
    }

    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty) {
      e.preventDefault();
      if (items.length === 1) {
        onDelete(id);
      } else {
        const newItems = items.filter((_, i) => i !== idx);
        updateContent(newItems);
      }
    }
  };

  const handleBlur = (idx: number, value: string) => {
    const newItems = [...items];
    newItems[idx] = value;
    updateContent(newItems);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.listBlock}
        >
          <div {...provided.dragHandleProps} className={styles.dragHandle}>
            ⋮
          </div>
          <ul ref={listRef} className={styles.bullet}>
            {items.map((item, idx) => (
              <li key={idx}>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: item }}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onBlur={(e) => handleBlur(idx, e.currentTarget.textContent || '')}
                  className={styles.editableContent}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Draggable>
  );
}
