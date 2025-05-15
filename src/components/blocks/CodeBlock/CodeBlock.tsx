import Select from '@/components/Select/Select';
import { languages } from '@/config/languages';
import { useCodeBlock } from '@/hooks/useCodeBlock';
import { Draggable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { MdCopyAll, MdDone } from "react-icons/md";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

const CodeBlock = ({ id, index, ...props }: CodeBlockProps) => {
  const { handleUpdate } = useCodeBlock(id);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return props.language || 'javascript';
  });

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(props.content);

  useEffect(() => {
    if (props.language && props.language !== currentLanguage) {
      setCurrentLanguage(props.language);
    }
  }, [props.language, currentLanguage, id]);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLanguage(newLang);
    props.onChange(id, props.content, newLang);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEmpty = editableContent.trim() === '';

    if (isEmpty && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
      props.onDelete(id);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      props.onEnter(id);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = e.currentTarget.value.substring(0, start) + '  ' + e.currentTarget.value.substring(end);
      e.currentTarget.value = newValue;
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      setEditableContent(newValue);
      props.onChange(id, newValue, currentLanguage);
    }
  };

  return (
    <Draggable draggableId={String(id)} index={index}>
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
          <div
            className={styles.codeWrapper}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={styles.header}>
              <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={languages}
                placeholder="Select language..."
                size="default"
              />
              <button 
                onClick={handleCopy} 
                className={styles.copyButton}
                title={copied ? "Copied!" : "Copy code"}
                data-copied={copied}
              >
                {copied ? <MdDone /> : <MdCopyAll />}
              </button>
            </div>
            <div 
              className={styles.editorContainer}
              onClick={() => setIsEditing(true)}
            >
              <SyntaxHighlighter
                language={currentLanguage}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                }}
              >
                {editableContent || ' '}
              </SyntaxHighlighter>
              <textarea
                className={`${styles.editor} ${isEditing ? styles.visible : ''}`}
                value={editableContent}
                onChange={(e) => {
                  setEditableContent(e.target.value);
                  props.onChange(id, e.target.value, currentLanguage);
                }}
                onBlur={() => setIsEditing(false)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export { CodeBlock };

