import { useEffect, useId, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiChevronDown, HiMagnifyingGlass, HiOutlineExclamationCircle } from 'react-icons/hi2';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onClickTrigger?: (e: React.MouseEvent) => void;
  size?: 'default' | 'compact';
}

export default function Select({ 
  label,
  value, 
  options, 
  onChange, 
  placeholder,
  loading,
  className,
  emptyMessage = 'No options available',
  onClickTrigger,
  size = 'default',
}: SelectProps) {
  const selectId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const selected = options.find(option => option.value === value);
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClickTrigger?.(e);
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value);
    setIsOpen(false);
  };

  const preventSelectionLoss = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.setStart(range.startContainer, range.startOffset);
      range.setEnd(range.endContainer, range.endOffset);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const highlighted = optionsRef.current?.children[highlightedIndex] as HTMLElement;
    if (highlighted) {
      highlighted.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div 
      ref={selectRef}
      className={`${styles.select} ${className || ''}`}
      data-size={size}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-labelledby={selectId}
      onMouseDown={(e) => {
        preventSelectionLoss(e);
        e.preventDefault();
      }}
    >
      {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
      <button 
        id={selectId}
        className={`${styles.trigger} select-trigger`}
        onMouseDown={(e) => {
          preventSelectionLoss(e);
          handleTriggerClick(e);
        }}
        disabled={loading}
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <span className={styles.value}>
          {loading ? (
            <span className={styles.loading}>
              <AiOutlineLoading3Quarters />
              Loading...
            </span>
          ) : (
            <>
              {selected?.icon && <span className={styles.icon}>{selected.icon}</span>}
              <span>{selected?.label || placeholder}</span>
            </>
          )}
        </span>
        <HiChevronDown className={styles.arrow} />
      </button>

      {(isOpen || isVisible) && (
        <div 
          className={styles.dropdown}
          data-show={isOpen}
          role="presentation"
          onMouseDown={(e) => {
            preventSelectionLoss(e);
            e.preventDefault();
          }}
        >
          {options.length > 0 && (
            <div className={styles.search}>
              <HiMagnifyingGlass aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e as unknown as KeyboardEvent)}
                aria-controls={listboxId}
                aria-autocomplete="list"
                autoFocus
              />
            </div>
          )}
          <ul 
            ref={optionsRef}
            id={listboxId}
            role="listbox"
            aria-label="Options"
            tabIndex={-1}
          >
            {loading ? (
              <li className={styles.loading}>
                <AiOutlineLoading3Quarters />
                Loading options...
              </li>
            ) : options.length === 0 ? (
              <li className={styles.empty}>
                <HiOutlineExclamationCircle />
                {emptyMessage}
              </li>
            ) : filteredOptions.length === 0 ? (
              <li 
                className={styles.empty}
                role="status"
                aria-live="polite"
              >
                No results found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li 
                  key={option.value}
                  role="option"
                  id={`${listboxId}-${index}`}
                  aria-selected={option.value === value}
                  data-highlighted={index === highlightedIndex}
                  tabIndex={-1}
                  onMouseDown={(e) => handleOptionClick(e, option.value)}
                >
                  {option.icon && (
                    <span className={styles.icon} aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
