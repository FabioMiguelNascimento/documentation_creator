import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary',
    size = 'md',
    icon,
    isLoading,
    fullWidth,
    className,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          ${styles.button}
          ${styles[variant]}
          ${styles[size]}
          ${fullWidth ? styles.fullWidth : ''}
          ${isLoading ? styles.loading : ''}
          ${className || ''}
        `}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className={styles.loader} />
        ) : (
          <>
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
