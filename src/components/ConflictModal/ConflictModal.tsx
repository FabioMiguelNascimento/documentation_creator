import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './ConflictModal.module.scss';

interface ExportFile {
  docId: string;
  title: string;
  content: string;
}

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ExportFile[];
  conflictingFiles: ExportFile[];
  format: string;
  onResolve: (files: ExportFile[]) => void;
}

export default function ConflictModal({
  isOpen,
  onClose,
  files,
  conflictingFiles,
  format,
  onResolve
}: ConflictModalProps) {
  const [renamedFiles, setRenamedFiles] = useState<ExportFile[]>([]);
  const [hasConflicts, setHasConflicts] = useState(true);

  useEffect(() => {
    if (isOpen && files.length > 0) {
      setRenamedFiles(files);
      checkConflicts(files);
    }
  }, [isOpen, files]);

  const checkConflicts = (currentFiles: typeof renamedFiles) => {
    const names = new Set<string>();
    let conflicts = false;

    currentFiles.forEach(file => {
      if (!file.title.trim()) {
        conflicts = true;
        return;
      }

      const normalizedName = file.title.toLowerCase();
      if (names.has(normalizedName)) {
        conflicts = true;
      }
      names.add(normalizedName);
    });

    setHasConflicts(conflicts);
  };

  const handleRename = (docId: string, newTitle: string) => {
    const newFiles = renamedFiles.map(file =>
      file.docId === docId ? { ...file, title: newTitle } : file
    );
    setRenamedFiles(newFiles);
    checkConflicts(newFiles);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resolver conflitos de nome"
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.warning}>
            <svg viewBox="0 0 24 24" className={styles.warningIcon}>
              <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" fill="currentColor"/>
            </svg>
            <div>
              <h4>Conflitos encontrados</h4>
              <p>Os seguintes {conflictingFiles.length} documentos precisam de nomes únicos:</p>
            </div>
          </div>
        </div>

        <div className={styles.list}>
          {conflictingFiles.map(file => {
            const currentFile = renamedFiles.find(f => f.docId === file.docId);
            const isDuplicate = renamedFiles.filter(f => 
              f.title.toLowerCase() === currentFile?.title.toLowerCase()
            ).length > 1;

            return (
              <div key={file.docId} className={`${styles.item} ${isDuplicate ? styles.itemConflict : ''}`}>
                <div className={styles.itemContent}>
                  <div className={`${styles.preview} ${isDuplicate ? styles.hasError : ''}`}>
                    <i className={styles.fileIcon} />
                    <input
                      type="text"
                      value={currentFile?.title || ''}
                      onChange={e => handleRename(file.docId, e.target.value)}
                      className={`${styles.input} ${isDuplicate ? styles.inputError : ''}`}
                      placeholder="Digite um novo nome..."
                    />
                    <div className={styles.extension}>.{format}</div>
                  </div>
                  <div className={`${styles.errorMessage} ${isDuplicate ? styles.errorMessageShow : ''}`}>
                    Este nome já está em uso
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <span className={styles.conflictCounter}>
            {hasConflicts ? `${conflictingFiles.length} conflitos restantes` : 'Todos os conflitos resolvidos'}
          </span>
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onResolve(renamedFiles);
              }}
              disabled={hasConflicts}
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
