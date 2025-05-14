import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  value: number;
  indeterminate?: boolean;
}

export default function ProgressBar({ value, indeterminate }: ProgressBarProps) {
  return (
    <div className={styles.container}>
      <div 
        className={`${styles.bar} ${indeterminate ? styles.indeterminate : ''}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
