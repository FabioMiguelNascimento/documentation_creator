import { Block } from '@/types/documentation';
import styles from './EditorSidebar.module.scss';

interface EditorSidebarProps {
  onCreateBlock: (type: Block['type']) => void;
  onExport: (type: 'md' | 'html' | 'jsx') => void;
}

export default function EditorSidebar({ onCreateBlock, onExport }: EditorSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <section className={styles.section}>
        <h3>Adicionar Bloco</h3>
        <div className={styles.blockButtons}>
          <button onClick={() => onCreateBlock('text')}>
            <span>Texto</span>
          </button>
          <button onClick={() => onCreateBlock('list')}>
            <span>Lista</span>
          </button>
          <button onClick={() => onCreateBlock('code')}>
            <span>Código</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Exportar</h3>
        <div className={styles.exportButtons}>
          <button onClick={() => onExport('md')}>
            <span>Markdown</span>
          </button>
          <button onClick={() => onExport('html')}>
            <span>HTML</span>
          </button>
          <button onClick={() => onExport('jsx')}>
            <span>React</span>
          </button>
        </div>
      </section>
    </div>
  );
}
