"use client";

import Button from "@/components/Button/Button";
import Dropdown, { DropdownItem } from "@/components/Dropdown/Dropdown";
import Checkbox from "@/components/Select/Checkbox/Checkbox";
import { useToast } from "@/contexts/ToastContext";
import { useDocumentSelection } from "@/hooks/useDocumentSelection";
import { documentStorage } from "@/services/documentStorage";
import { Documentation } from "@/types/documentation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiCheck,
  HiDotsVertical,
  HiDownload,
  HiDuplicate,
  HiOutlinePlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import ExportModal from "../ExportModal/ExportModal";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isSelectionMode,
    selectedDocs,
    toggleSelection,
    toggleSelectionMode,
    selectAll
  } = useDocumentSelection();
  const router = useRouter();
  const [showExportModal, setShowExportModal] = useState(false);
  const { showToast } = useToast();
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setDocs(documentStorage.get());
      setIsLoading(false);
    };
    const handleSingleUpdate = (e: CustomEvent<{ doc: Documentation }>) => {
      setDocs(docs => docs.map(d => 
        d.id === e.detail.doc.id ? e.detail.doc : d
      ));
    };

    handleUpdate();
    document.addEventListener('docsUpdated', handleUpdate);
    document.addEventListener('docUpdated', handleSingleUpdate as EventListener);
    
    return () => {
      document.removeEventListener('docsUpdated', handleUpdate);
      document.removeEventListener('docUpdated', handleSingleUpdate as EventListener);
    };
  }, []);

  const handleNewDoc = () => {
    const newDoc: Documentation = {
      id: `doc-${Date.now()}`,
      slug: `doc-${Date.now()}`,
      title: "Nova Documentação",
      description: "Clique para editar",
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [...docs, newDoc];
    documentStorage.save(updatedDocs);
    router.push(`/docs/${newDoc.slug}`);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = docs.filter((d) => d.id !== docId);
    documentStorage.save(updatedDocs);
    setDocs(updatedDocs);
    showToast('Documento excluído com sucesso', 'success');
  };

  const handleDuplicate = (doc: Documentation) => {
    const newDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      title: `${doc.title} (Cópia)`,
      slug: `${doc.slug}-copy-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedDocs = [...docs, newDoc];
    documentStorage.save(updatedDocs);
    setDocs(updatedDocs);
    showToast('Documento duplicado com sucesso', 'success');
  };

  const handleSelectAll = () => {
    selectAll(docs.map(doc => doc.id));
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleRename = (docId: string, newTitle: string) => {
    const title = newTitle.trim() || 'New Doc';
    const updatedDocs = docs.map(doc => 
      doc.id === docId 
        ? { 
            ...doc, 
            title,
            updatedAt: new Date().toISOString() 
          } 
        : doc
    );
    
    documentStorage.save(updatedDocs);
    setDocs(updatedDocs);
    showToast('Documento renomeado com sucesso', 'success');
  };

  const selectedDocuments = docs.filter(doc => selectedDocs.includes(doc.id));

  const renderDocItem = (doc: Documentation) => (
    <div 
      key={`doc-${doc.id}`}
      className={styles.docItem}
      data-selected={selectedDocs.includes(doc.id)}
      data-doc-id={doc.id}
      tabIndex={isSelectionMode ? 0 : undefined}
      role={isSelectionMode ? "button" : undefined}
      aria-pressed={isSelectionMode ? selectedDocs.includes(doc.id) : undefined}
      onClick={isSelectionMode ? () => toggleSelection(doc.id) : undefined}
      onKeyDown={(e) => {
        if (isSelectionMode && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          toggleSelection(doc.id);
        }
      }}
    >
      {isSelectionMode ? (
        <div className={styles.itemContent}>
          <Checkbox
            checked={selectedDocs.includes(doc.id)}
            onChange={() => toggleSelection(doc.id)}
            tabIndex={-1}
          />
          <span className={styles.title}>{doc.title}</span>
        </div>
      ) : (
        <Link
          href={`/docs/${doc.slug}`}
          className={styles.docLink}
          onClick={e => isSelectionMode && e.preventDefault()}
        >
          {doc.title}
        </Link>
      )}
      {!isSelectionMode && (
        <div 
          className={styles.options}
          onClick={e => e.stopPropagation()}
        >
          <Dropdown trigger={<HiDotsVertical />} align="right">
            <DropdownItem 
              icon={<HiPencil />}
              onClick={() => handleRename(doc.id, prompt('Novo nome:', doc.title) || doc.title)}
            >
              Rename
            </DropdownItem>
            <DropdownItem
              icon={<HiDuplicate />}
              onClick={() => handleDuplicate(doc)}
            >
              Clone
            </DropdownItem>
            <DropdownItem icon={<HiDownload />} onClick={toggleSelectionMode}>
              Export
            </DropdownItem>
            <DropdownItem
              icon={<HiTrash />}
              onClick={() => handleDelete(doc.id)}
              className={styles.deleteItem}
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  );

  return (
    <nav 
      ref={navigationRef}
      className={styles.navigation}
    >
      {isSelectionMode ? (
        <div className={styles.header} data-selection-mode={true}>
          <h1>Selecionar documentos</h1>
          <div className={styles.actions}>
            <Button
              size="sm"
              variant="primary"
              icon={<HiCheck />}
              onClick={handleSelectAll}
              fullWidth
            >
              {selectedDocs.length === docs.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button 
              size="sm"
              variant="secondary"
              onClick={toggleSelectionMode}
              fullWidth
            >
              Cancel
            </Button>
          </div>
          <Button 
            variant="primary"
            onClick={handleExport}
            fullWidth
            disabled={selectedDocs.length === 0}
          >
            Export {selectedDocs.length || 'no'} documents
          </Button>
        </div>
      ) : (
        <div className={styles.header}>
          <h1>DocBuilder</h1>
          <Button
            icon={<HiOutlinePlus />}
            onClick={handleNewDoc}
            fullWidth
          >
            New doc
          </Button>
        </div>
      )}

      <div className={styles.docsList}>
        <h2>Current Docs</h2>
        {isLoading ? (
          <>
            <div className={styles.docItemSkeleton} />
            <div className={styles.docItemSkeleton} />
            <div className={styles.docItemSkeleton} />
          </>
        ) : (
          docs.map(renderDocItem)
        )}
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        selectedDocs={selectedDocuments}
      />
    </nav>
  );
}
