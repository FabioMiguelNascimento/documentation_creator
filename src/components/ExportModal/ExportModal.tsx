import { useToast } from '@/contexts/ToastContext';
import { zipExporter } from '@/services/zipExporter';
import { Documentation } from '@/types/documentation';
import { useEffect, useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import Button from '../Button/Button';
import ConflictModal from '../ConflictModal/ConflictModal';
import Modal from '../Modal/Modal';
import ProgressBar from '../ProgressBar/ProgressBar';
import Select from '../Select/Select';
import styles from './ExportModal.module.scss';

type ExportFormat = 'md' | 'html' | 'jsx';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocs: Documentation[];
}

export default function ExportModal({ isOpen, onClose, selectedDocs }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('md');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showConflicts, setShowConflicts] = useState(false);
  const [preparedFiles, setPreparedFiles] = useState<Array<{ docId: string; title: string; content: string }>>([]);
  const [conflicts, setConflicts] = useState<Array<{ docId: string; title: string; content: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const updateEstimatedSize = async () => {
      const files = zipExporter.prepareFiles(selectedDocs, format);
      const size = await zipExporter.estimateZipSize(files);
      setEstimatedSize(size);
    };

    updateEstimatedSize();
  }, [selectedDocs, format]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    
    try {
      const files = zipExporter.prepareFiles(selectedDocs, format);
      const conflictingFiles = zipExporter.findConflictingFiles(files);

      if (conflictingFiles.length > 0) {
        setPreparedFiles(files);
        setConflicts(conflictingFiles);
        setShowConflicts(true);
      } else {
        await zipExporter.exportToZip(files, format, {
          onProgress: setProgress
        });
        showToast('Documentos exportados com sucesso!', 'success');
        onClose();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao exportar documentos';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResolveConflicts = async (resolvedFiles: typeof preparedFiles) => {
    setIsExporting(true);
    setProgress(0);
    
    try {
      await zipExporter.exportToZip(resolvedFiles, format, {
        onProgress: (value) => {
          setProgress(value);
        }
      });
      showToast('Documentos exportados com sucesso!', 'success');
      onClose();
    } catch (error) {
      console.error('Error exporting:', error);
      showToast('Erro ao exportar documentos.', 'error');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleExport();
  };

  const getProgressMessage = (progress: number) => {
    if (progress < 40) return 'Preparing files...';
    if (progress < 80) return 'Compressing...';
    if (progress < 100) return 'Finalizing...';
    return 'Done!';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Documents"
      size="md"
    >
      <div className={styles.content}>
        <div className={styles.options}>
          <Select
            label="Format"
            value={format}
            onChange={(value) => setFormat(value as ExportFormat)}
            options={[
              { value: 'md', label: 'Markdown (.md)' },
              { value: 'html', label: 'HTML (.html)' },
              { value: 'jsx', label: 'React Component (.jsx)' }
            ]}
          />
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <h3>Selected Documents</h3>
            {estimatedSize && (
              <div className={styles.zipInfo}>
                Estimated ZIP size: {formatSize(estimatedSize)}
              </div>
            )}
          </div>
          <div className={styles.docsList}>
            {selectedDocs.map(doc => (
              <div key={doc.id} className={styles.docItem}>
                <span className={styles.docTitle}>{doc.title}</span>
                <span className={styles.format}>.{format}</span>
              </div>
            ))}
          </div>
        </div>

        {isExporting && (
          <div className={styles.progressSection}>
            <ProgressBar value={progress} />
            <span className={styles.progressLabel}>
              {getProgressMessage(progress)}
            </span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button
              variant="primary"
              onClick={handleRetry}
              disabled={isExporting}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<HiDownload />}
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting || !!error}
          >
            {error ? 'Falha na exportação' : `Export ${selectedDocs.length} documents`}
          </Button>
        </div>
      </div>

      <ConflictModal
        isOpen={showConflicts}
        onClose={() => setShowConflicts(false)}
        files={preparedFiles}
        conflictingFiles={conflicts}
        format={format}
        onResolve={handleResolveConflicts}
      />
    </Modal>
  );
}
