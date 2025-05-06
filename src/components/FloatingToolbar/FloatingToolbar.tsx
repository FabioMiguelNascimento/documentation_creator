import ColorPicker from '@/components/ColorPicker/ColorPicker';
import Select, { SelectOption } from '@/components/Select/Select';
import { Editor } from '@tiptap/react';
import { HiCode, HiMinus, HiPencilAlt } from 'react-icons/hi';
import { HiBold, HiCodeBracket } from 'react-icons/hi2';
import { TbH1, TbH2, TbH3 } from 'react-icons/tb';
import styles from './FloatingToolbar.module.scss';

interface FloatingToolbarProps {
  editor: Editor | null;
  show: boolean;
  position: { x: number; y: number };
  onTransformToCodeBlock?: () => void;
}

const blockOptions: SelectOption[] = [
  { value: 'h1', label: 'Heading 1', icon: <TbH1 /> },
  { value: 'h2', label: 'Heading 2', icon: <TbH2 /> },
  { value: 'h3', label: 'Heading 3', icon: <TbH3 /> },
  { value: 'inline-code', label: 'Inline Code', icon: <HiCode /> },
  { value: 'code-block', label: 'Code Block', icon: <HiCodeBracket /> },
];

export default function FloatingToolbar({ editor, show, position, onTransformToCodeBlock }: FloatingToolbarProps) {
  if (!editor || !show) return null;

  const getCurrentBlockValue = () => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('code')) return 'inline-code';
    return '';
  };

  const handleBlockChange = (value: string) => {
    switch (value) {
      case 'h1':
      case 'h2':
      case 'h3':
        editor.chain().focus().toggleHeading({ level: parseInt(value[1]) }).run();
        break;
      case 'inline-code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'code-block':
        onTransformToCodeBlock?.();
        break;
    }
  };

  const handleColorChange = (color: string) => {
    if (!editor) return;
    
    editor.chain().focus().setColor(color).run();
  };

  const handleBackgroundChange = (color: string) => {
    if (!editor) return;
    
    if (color === 'transparent') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
  };

  const isColorActive = (color: string) => editor?.isActive('textStyle', { color });

  return (
    <div 
      className={styles.toolbar}
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 100
      }}
    >
      <div className={styles.group}>
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
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? styles.active : ''}
        >
          <HiMinus />
        </button>
        <ColorPicker 
          onTextColorSelect={handleColorChange}
          onBackgroundColorSelect={handleBackgroundChange}
        />
      </div>

      <div className={styles.group}>
        <Select
          value={getCurrentBlockValue()}
          options={blockOptions}
          onChange={handleBlockChange}
          placeholder="Text"
        />
      </div>
    </div>
  );
}
