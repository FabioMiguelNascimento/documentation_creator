import { Block } from '@/types/documentation';
import styles from './BlockCreator.module.scss';

interface BlockCreatorProps {
  onCreateBlock: (block: Block) => void;
}

export default function BlockCreator({ onCreateBlock }: BlockCreatorProps) {
  const createBlock = (type: Block['type']) => {
    const block: Block = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: Date.now(),
      language: type === 'code' ? 'javascript' : undefined
    };
    onCreateBlock(block);
  };

  return (
    <div className={styles.creator}>
      <button onClick={() => createBlock('text')}>
        + Texto
      </button>
      <button onClick={() => createBlock('code')}>
        + Código
      </button>
    </div>
  );
}
