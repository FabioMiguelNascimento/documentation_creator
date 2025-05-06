import FloatingToolbar from '@/components/FloatingToolbar/FloatingToolbar';
import { useTextBlock } from '@/hooks/useTextBlock';
import { Draggable } from "@hello-pangea/dnd";
import { Extension } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { useEffect, useRef, useState } from "react";
import '../../../styles/markdown.scss';
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

const Placeholder = Extension.create({
  name: 'placeholder',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc }) => {
            const active = this.editor?.isEditable && 
              doc.textContent.length === 0 && 
              this.editor.isFocused;
              
            if (!active) return DecorationSet.empty

            const decorations = []
            const decoration = Decoration.widget(0, () => {
              const placeholder = document.createElement('span')
              placeholder.classList.add('placeholder')
              placeholder.textContent = this.options.placeholder
              return placeholder
            })
            decorations.push(decoration)

            return DecorationSet.create(doc, decorations)
          }
        }
      })
    ]
  }
});

interface TextBlockProps {
  id: string;
  content: string;
  index: number;
  onChange: (id: string, content: string) => void;
  onEnter: (id: string) => string;
  onDelete: (id: string) => void;
  onTransform?: (id: string, type: 'text' | 'list' | 'code', content: string, language?: string) => void;
}

export default function TextBlock({ 
  id, 
  content, 
  index,
  onChange,
  onDelete,
  onTransform,
  onEnter
}: TextBlockProps) {
  const { handleUpdate } = useTextBlock(id);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0, show: false });
  const [isTransforming, setIsTransforming] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!blockRef.current?.contains(event.target as Node) && 
          !toolbarRef.current?.contains(event.target as Node)) {
        setToolbarPosition(prev => ({ ...prev, show: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: {
          HTMLAttributes: {
            class: 'inline-code',
          },
        },
      }),
      Link,
      CodeBlockDetector,
      Placeholder.configure({
        placeholder: 'Start typing or insert "/" for commands',
      }),
      TextStyle,
      Color,
      Highlight.configure({ 
        multicolor: true,
        HTMLAttributes: {
          class: 'highlighted-text',
        },
      })
    ],
    content,
    editable: true,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        contenteditable: 'true',
      },
      handleKeyDown: (_, event) => {
        if (!editor) return false;

        const { from } = editor.state.selection;
        const $pos = editor.state.doc.resolve(from);
        const currentLine = editor.state.doc.textBetween($pos.start(), $pos.end());

        if ((event.key === 'Backspace' || event.key === 'Delete') && editor.isEmpty) {
          event.preventDefault();
          event.stopPropagation();
          onDelete(id);
          return true;
        }

        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();

          const codeBlockMatch = currentLine.match(/^```(\w*)$/);
          if (codeBlockMatch) {
            const [, language] = codeBlockMatch;
            onTransform(id, 'code', '', language || 'javascript');
            return true;
          }

          onEnter(id);
          return true;
        }

        return false;
      }
    },
    onUpdate: ({ editor }) => {
      if (isTransforming) return;

      const content = editor.getHTML();
      const text = editor.getText();
      
      const codeBlockMatch = text.match(/^```(\w*)$/);
      if (codeBlockMatch) {
        const [, language] = codeBlockMatch;
        setIsTransforming(true);
        onTransform(id, 'code', '', language || 'javascript');
        setTimeout(() => {
          setIsTransforming(false);
        }, 0);
        return;
      }

      onChange(id, content);
    },
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
  });

  const handleTransformToCodeBlock = () => {
    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    
    if (selectedText) {
      onTransform(id, 'code', selectedText, 'javascript');
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          id={id}
          ref={(node) => {
            blockRef.current = node;
            provided.innerRef(node);
          }}
          {...provided.draggableProps}
          className={`${styles.textBlock} inlineFormatting`}
        >
          <div className={styles.blockControls}>
            <div {...provided.dragHandleProps} className={styles.dragHandle}>
              ⋮
            </div>
          </div>
          <EditorContent 
            editor={editor} 
            className={styles.editableContent}
          />
          {editor && (
            <FloatingToolbar
              ref={toolbarRef}
              editor={editor}
              show={toolbarPosition.show}
              position={toolbarPosition}
              onTransformToCodeBlock={handleTransformToCodeBlock}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}
