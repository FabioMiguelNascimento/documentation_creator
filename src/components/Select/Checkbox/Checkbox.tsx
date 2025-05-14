import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          ref={ref}
          className={`${styles.input} ${className || ''}`}
          {...props}
        />
        <span className={styles.checkmark} />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
