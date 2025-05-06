import Select, { SelectOption } from '@/components/Select/Select';
import { Draggable } from '@hello-pangea/dnd';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism.css';
import { useEffect, useRef, useState } from 'react';
import { SiCss3, SiHtml5, SiJavascript, SiReact, SiSass, SiTypescript } from 'react-icons/si';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  id: string;
  content: string;
  language?: string;
  index: number;
  onChange: (id: string, content: string, language?: string) => void;
  onDelete: (id: string) => void;
}

const languageOptions: SelectOption[] = [
  { value: 'javascript', label: 'JavaScript', icon: <SiJavascript /> },
  { value: 'typescript', label: 'TypeScript', icon: <SiTypescript /> },
  { value: 'jsx', label: 'JSX', icon: <SiReact /> },
  { value: 'tsx', label: 'TSX', icon: <SiReact /> },
  { value: 'html', label: 'HTML', icon: <SiHtml5 /> },
  { value: 'css', label: 'CSS', icon: <SiCss3 /> },
  { value: 'scss', label: 'SCSS', icon: <SiSass /> },
];

export default function CodeBlock({ 
  id, 
  content, 
  language = 'javascript',
  index, 
  onChange,
  onDelete
}: CodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(content);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!isEditing && preRef.current) {
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
      preRef.current.innerHTML = highlightedCode;
    }
  }, [isEditing, code, language]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(id, code, language);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      return;
    }

    if (e.key === 'Enter' && e.shiftKey) {
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      setCode(
        code.substring(0, start) + '\n' + code.substring(end)
      );
      
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
      
      e.preventDefault();
      return;
    }

    const isEmpty = !e.currentTarget.value.trim();
    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty) {
      e.preventDefault();
      onDelete(id);
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      setCode(
        code.substring(0, start) + '  ' + code.substring(end)
      );

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.codeBlock}
        >
          <div {...provided.dragHandleProps} className={styles.dragHandle}>
            ⋮
          </div>
          <div className={styles.codeWrapper}>
            <Select
              value={language}
              options={languageOptions}
              onChange={(value) => onChange(id, code, value)}
              placeholder="Select language"
            />
            {isEditing ? (
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={styles.editor}
                autoFocus
              />
            ) : (
              <pre 
                ref={preRef}
                onClick={() => setIsEditing(true)}
                className={`language-${language}`}
              >
                <code>{code}</code>
              </pre>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
