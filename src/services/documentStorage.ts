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

  update(doc: Documentation, notify = true) {
    const docs = this.get();
    const updatedDocs = docs.map(d => d.id === doc.id ? doc : d);
    localStorage.setItem("docs", JSON.stringify(updatedDocs));
    
    if (notify) {
      document.dispatchEvent(new CustomEvent('docUpdated', { 
        detail: { doc } 
      }));
    }
  }
};
