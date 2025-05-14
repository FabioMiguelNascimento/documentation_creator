import { Documentation } from "@/types/documentation";
import JSZip from "jszip";
import { htmlExporter } from "./htmlExporter";
import { jsExporter } from "./jsExporter";
import { markdownExporter } from "./markdownExporter";

type ExportFormat = "md" | "html" | "jsx";

interface ExportFile {
  docId: string;
  title: string;
  content: string;
}

interface ExportOptions {
  onProgress?: (progress: number) => void;
}

export const zipExporter = {
  prepareFiles(docs: Documentation[], format: ExportFormat): ExportFile[] {
    return docs.map((doc) => {
      let content = "";
      switch (format) {
        case "md":
          content = markdownExporter.exportToMarkdown(doc.blocks);
          break;
        case "html":
          content = htmlExporter.exportToHtml(doc.blocks);
          break;
        case "jsx":
          content = jsExporter.exportToJs(doc.blocks);
          break;
      }

      return {
        docId: doc.id,
        title: doc.title,
        content,
      };
    });
  },

  getUniqueFileName(fileName: string, existingNames: Set<string>) {
    let uniqueName = fileName;
    let counter = 1;

    while (existingNames.has(uniqueName)) {
      uniqueName = `${fileName}-${counter}`;
      counter++;
    }

    return uniqueName;
  },

  async exportToZip(
    files: ExportFile[],
    format: ExportFormat,
    options?: { onProgress: (value: number) => void }
  ) {
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      zip.file(`${file.title}.${format}`, file.content);

      const progress = (i / files.length) * 40;
      options?.onProgress?.(progress);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    options?.onProgress?.(40);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const blob = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
      },
      (metadata) => {
        const progress = 40 + metadata.percent * 0.4;
        options?.onProgress?.(progress);
      }
    );

    options?.onProgress?.(80);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documents.zip`;

    options?.onProgress?.(90);
    await new Promise((resolve) => setTimeout(resolve, 200));

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    options?.onProgress?.(100);
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  findConflictingFiles(files: ExportFile[]): ExportFile[] {
    const nameCount = new Map<string, number>();
    const normalizedNames = new Map<string, string>();

    // Primeiro, contar ocorrências de cada nome normalizado
    files.forEach(file => {
      const normalizedName = file.title.toLowerCase();
      nameCount.set(normalizedName, (nameCount.get(normalizedName) || 0) + 1);
      normalizedNames.set(file.docId, normalizedName);
    });

    // Depois, retornar apenas os arquivos com nomes duplicados
    return files.filter(file => {
      const normalizedName = normalizedNames.get(file.docId);
      return normalizedName && nameCount.get(normalizedName)! > 1;
    });
  },

  estimateZipSize: async (files: Array<{ title: string; content: string }>) => {
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.title, file.content);
    });
    
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob.size;
  },
};
