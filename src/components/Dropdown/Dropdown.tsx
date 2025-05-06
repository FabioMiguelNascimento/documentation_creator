import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
}

export default function Dropdown({ children, trigger, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < itemsRef.current.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : itemsRef.current.length - 1
        );
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) {
          itemsRef.current[activeIndex]?.click();
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;

      case 'Tab':
        if (!e.shiftKey && activeIndex === itemsRef.current.length - 1) {
          setIsOpen(false);
        } else if (e.shiftKey && activeIndex === 0) {
          setIsOpen(false);
        }
        break;
    }
  };

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      itemsRef.current[activeIndex]?.focus();
    }
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
    }
  }, [isOpen]);

  return (
    <div className={styles.dropdown} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger || <HiDotsVertical />}
      </button>
      <div 
        className={`${styles.content} ${styles[align]} ${isOpen ? styles.open : ''}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ref: (el: HTMLButtonElement) => (itemsRef.current[index] = el),
              tabIndex: isOpen ? 0 : -1,
              'aria-selected': activeIndex === index
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export const DropdownItem = React.forwardRef<
  HTMLButtonElement, 
  { 
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
    tabIndex?: number;
    'aria-selected'?: boolean;
  }
>(({ children, onClick, icon, className = '', ...props }, ref) => {
  return (
    <button 
      ref={ref}
      className={`${styles.item} ${className}`}
      onClick={() => {
        onClick?.();
      }}
      role="menuitem"
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
});

DropdownItem.displayName = 'DropdownItem';
