"use client";
import { Documentation } from "@/types/documentation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedDocs = localStorage.getItem("docs");
    if (savedDocs) {
      setDocs(JSON.parse(savedDocs));
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>Documentações Recentes</h1>
      <div className={styles.docsGrid}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={styles.docCard}
            onClick={() => router.push(`/docs/${doc.slug}`)}
          >
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <div className={styles.tags}>
              {doc.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
