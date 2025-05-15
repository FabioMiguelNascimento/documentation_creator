import { Documentation } from "@/types/documentation";

export const documentStorage = {
  save(docs: Documentation[], notify = false) {
    localStorage.setItem("docs", JSON.stringify(docs));
    if (notify) {
      document.dispatchEvent(new CustomEvent('docsUpdated'));
    }
  },

  get(): Documentation[] {
    const savedDocs = localStorage.getItem("docs");
    return savedDocs ? JSON.parse(savedDocs) : [];
  },

  update(doc: Documentation) {
    const docs = JSON.parse(localStorage.getItem('docs') || '[]');
    const updatedDocs = docs.map((d: Documentation) => 
      d.id === doc.id ? doc : d
    );
    
    localStorage.setItem('docs', JSON.stringify(updatedDocs));

    // Disparar evento para atualizar outros componentes
    const event = new CustomEvent('docUpdated', { detail: { doc } });
    document.dispatchEvent(event);
  }
};
