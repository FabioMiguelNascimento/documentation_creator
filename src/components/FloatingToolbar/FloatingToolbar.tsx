import { Editor } from '@tiptap/react';
import { HiCode, HiMinus, HiPencilAlt } from 'react-icons/hi';
import { HiBold } from 'react-icons/hi2';
import styles from './FloatingToolbar.module.scss';

interface FloatingToolbarProps {
  editor: Editor | null;
  show: boolean;
  position: { x: number; y: number };
}

export default function FloatingToolbar({ editor, show, position }: FloatingToolbarProps) {
  if (!editor || !show) return null;

  return (
    <div 
      className={styles.toolbar}
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.active : ''}
      >
        <HiBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.active : ''}
      >
        <HiPencilAlt />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? styles.active : ''}
      >
        <HiCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles.active : ''}
      >
        <HiMinus />
      </button>
    </div>
  );
}
