import { useRouter } from 'next/router';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>DocBuilder</h1>
      </div>
      
      <button 
        className={styles.newDocButton}
        onClick={() => router.push('/docs/new')}
      >
        + Nova Documentação
      </button>

      <nav className={styles.nav}>
        <h2>Documentações</h2>
      </nav>
    </aside>
  );
}
