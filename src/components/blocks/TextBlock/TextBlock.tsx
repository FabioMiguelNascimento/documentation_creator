import FloatingToolbar from '@/components/FloatingToolbar/FloatingToolbar';
import { Draggable } from "@hello-pangea/dnd";
import { Extension } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from "react";
import styles from './TextBlock.module.scss';

const CodeBlockDetector = Extension.create({
  name: 'codeBlockDetector',
  addKeyboardShortcuts() {
    return {
      'Backquote': ({ editor }) => {
        const { from } = editor.state.selection;
        const text = editor.state.doc.textBetween(0, from);
        const currentLine = text.split('\n').pop() || '';
        
        return currentLine.includes('```');
      }
    }
  }
});

interface TextBlockProps {
  id: string;
  content: string;
  index: number;
  onChange: (id: string, content: string) => void;
  onEnter: () => void;
  onDelete: (id: string) => void;
  onTransform?: (id: string, type: 'text' | 'list' | 'code', content: string, language?: string) => void;
}

export default function TextBlock({
  id,
  content,
  index,
  onChange,
  onEnter,
  onDelete,
  onTransform,
}: TextBlockProps) {
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0, show: false });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ code: false }),
      Link,
      CodeBlockDetector,
    ],
    content,
    onUpdate: ({ editor }) => onChange(id, editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      if (!editor.view.hasFocus() || editor.state.selection.empty) {
        setToolbarPosition(prev => ({ ...prev, show: false }));
        return;
      }

      const { from, to } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      
      setToolbarPosition({
        x: coords.left + (editor.view.coordsAtPos(to).left - coords.left) / 2,
        y: coords.top - 10,
        show: true
      });
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (!editor) return false;
        
        const { from } = editor.state.selection;
        const $pos = editor.state.doc.resolve(from);
        const currentLine = editor.state.doc.textBetween($pos.start(), $pos.end());

        if (currentLine.startsWith('```') && event.key === 'Enter') {
          const [, language] = currentLine.match(/^```(\w*)/) || ['', 'javascript'];
          event.preventDefault();
          onTransform?.(id, 'code', '', language);
          return true;
        }

        if (event.key === 'Enter' && !event.shiftKey && !currentLine.startsWith('```')) {
          onEnter();
          return true;
        }

        if (event.key === 'Backspace' && editor.isEmpty) {
          onDelete(id);
          return true;
        }

        return false;
      }
    },
    editable: true
  });

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.textBlock}
        >
          <div className={styles.blockControls}>
            <div {...provided.dragHandleProps} className={styles.dragHandle}>
              ⋮
            </div>
          </div>
          <EditorContent editor={editor} className={styles.editableContent} />
          {editor && (
            <FloatingToolbar
              editor={editor}
              show={toolbarPosition.show}
              position={toolbarPosition}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}
