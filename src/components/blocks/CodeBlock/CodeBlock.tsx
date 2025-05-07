import Select, { SelectOption } from '@/components/Select/Select';
import { useSelection } from '@/contexts/SelectionContext';
import { withSelectable } from '@/hocs/withSelectable';
import { useCodeBlock } from '@/hooks/useCodeBlock';
import '@/styles/prism-theme.scss';
import { Draggable } from '@hello-pangea/dnd';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiCss3, SiHtml5, SiJavascript, SiMysql, SiReact, SiSass, SiTypescript } from 'react-icons/si';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  id: string;
  content: string;
  language?: string;
  index: number;
  onDelete: (id: string) => void;
  onChange: (id: string, content: string, language: string) => void;
  onEnter: (id: string) => string;
}

const languageOptions: SelectOption[] = [
  { value: 'javascript', label: 'JavaScript', icon: <SiJavascript /> },
  { value: 'typescript', label: 'TypeScript', icon: <SiTypescript /> },
  { value: 'jsx', label: 'JSX', icon: <SiReact /> },
  { value: 'tsx', label: 'TSX', icon: <SiReact /> },
  { value: 'html', label: 'HTML', icon: <SiHtml5 /> },
  { value: 'css', label: 'CSS', icon: <SiCss3 /> },
  { value: 'scss', label: 'SCSS', icon: <SiSass /> },
  { value: 'sql', label: 'SQL', icon: <SiMysql /> },
  { value: 'mysql', label: 'MySQL', icon: <SiMysql /> }
];

const CodeBlockComponent = ({ id, index, ...props }: CodeBlockProps) => {
  const { handleUpdate } = useCodeBlock(id);
  const { state } = useSelection();
  const preRef = useRef<HTMLPreElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState(props.language || 'javascript');

  const updateCodeHighlight = useCallback(() => {
    if (!preRef.current) return;
    
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const preElement = preRef.current;
    const start = range.startContainer;
    const startOffset = range.startOffset;
    
    let currentPos = 0;
    const calculatePosition = (node: Node, target: Node) => {
      if (node === target) return true;
      if (node.nodeType === Node.TEXT_NODE) {
        currentPos += node.textContent?.length || 0;
      }
      for (const child of Array.from(node.childNodes)) {
        if (calculatePosition(child, target)) return true;
      }
      return false;
    };
    
    calculatePosition(preElement, start);
    const absolutePosition = currentPos + startOffset;
    
    const content = preElement.textContent || '';
    const highlightedCode = Prism.highlight(
      content,
      Prism.languages[currentLanguage] || Prism.languages.javascript,
      currentLanguage
    );
    preElement.innerHTML = `<code>${highlightedCode}</code>`;

    const setPosition = (node: Node, pos: number): number => {
      if (node.nodeType === Node.TEXT_NODE) {
        const length = node.textContent?.length || 0;
        if (pos <= length) {
          const newRange = document.createRange();
          newRange.setStart(node, pos);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
          return -1;
        }
        return pos - length;
      }
      
      for (const child of Array.from(node.childNodes)) {
        pos = setPosition(child, pos);
        if (pos === -1) break;
      }
      return pos;
    };

    setPosition(preElement, absolutePosition);
  }, [currentLanguage]);

  useEffect(() => {
    updateCodeHighlight();
  }, [props.content, currentLanguage]);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLanguage(newLang);
    props.onChange(id, props.content, newLang);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLPreElement>) => {
    const isEmpty = !e.currentTarget.textContent?.trim();

    if ((e.key === 'Backspace' || e.key === 'Delete') && isEmpty) {
      e.preventDefault();
      e.stopPropagation();
      props.onDelete(id);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlockId = props.onEnter(id);
      return;
    }

    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  };

  return (
    <Draggable draggableId={String(id)} index={index} isDragDisabled={state.isSelecting}>
      {(provided) => (
        <div
          id={id}
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
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={languageOptions}
                placeholder="Select language..."
              />
            </div>
            <pre 
              ref={preRef}
              contentEditable
              onKeyDown={handleKeyDown}
              className={`language-${currentLanguage}`}
              suppressContentEditableWarning
              onInput={(e) => {
                const content = e.currentTarget.textContent || '';
                props.onChange(id, content, currentLanguage);
                updateCodeHighlight();
              }}
            >
              <code>{props.content}</code>
            </pre>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const CodeBlock = withSelectable(CodeBlockComponent);
