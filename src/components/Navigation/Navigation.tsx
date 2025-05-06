"use client";

import Dropdown, { DropdownItem } from "@/components/Dropdown/Dropdown";
import { Documentation } from "@/types/documentation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiDotsVertical,
  HiDownload,
  HiDuplicate,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import styles from "./Navigation.module.scss";

export default function Navigation() {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedDocs = localStorage.getItem("docs");
    if (savedDocs) {
      setDocs(JSON.parse(savedDocs));
    }
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
    localStorage.setItem("docs", JSON.stringify(updatedDocs));
    setDocs(updatedDocs);
    router.push(`/docs/${newDoc.slug}`);
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = docs.filter((d) => d.id !== docId);
    localStorage.setItem("docs", JSON.stringify(updatedDocs));
    setDocs(updatedDocs);
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
    localStorage.setItem("docs", JSON.stringify(updatedDocs));
    setDocs(updatedDocs);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.header}>
        <h1>DocBuilder</h1>
      </div>

      <button onClick={handleNewDoc} className={styles.newButton}>
        + Nova Documentação
      </button>

      <div className={styles.docsList}>
        <h2>Documentações</h2>
        {docs.map((doc) => (
          <div key={doc.id} className={styles.docItem}>
            <Link href={`/docs/${doc.slug}`} className={styles.docLink}>
              {doc.title}
            </Link>
            <div className={styles.options}>
              <Dropdown trigger={<HiDotsVertical />} align="right">
                <DropdownItem icon={<HiPencil />}>Renomear</DropdownItem>
                <DropdownItem
                  icon={<HiDuplicate />}
                  onClick={() => handleDuplicate(doc)}
                >
                  Duplicar
                </DropdownItem>
                <DropdownItem icon={<HiDownload />}>Exportar</DropdownItem>
                <DropdownItem
                  icon={<HiTrash />}
                  onClick={() => handleDelete(doc.id)}
                  className={styles.deleteItem}
                >
                  Excluir
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
