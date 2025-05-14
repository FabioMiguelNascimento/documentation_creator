import { HiCheck, HiX } from 'react-icons/hi';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === 'success' ? <HiCheck size={20} /> : <HiX size={20} />}
      {message}
    </div>
  );
}
