import Select, { SelectOption } from '@/components/Select/Select';
import '@/styles/prism-theme.scss';
import { Draggable } from '@hello-pangea/dnd';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
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
  const [code, setCode] = useState(content);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
      preRef.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLPreElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      return;
    }

    const isEmpty = !e.currentTarget.textContent?.trim();
    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty) {
      e.preventDefault();
      onDelete(id);
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  const handleInput = () => {
    const text = preRef.current?.textContent || '';
    setCode(text);
    onChange(id, text, language);
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
            <div className={styles.selectWrapper}>
              <Select
                value={language}
                onChange={(value) => onChange(id, code, value)}
                options={languageOptions}
                placeholder="Select language..."
              />
            </div>
            <pre 
              ref={preRef}
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className={`language-${language}`}
              suppressContentEditableWarning
            >
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </Draggable>
  );
}
