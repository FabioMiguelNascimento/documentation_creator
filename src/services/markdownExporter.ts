import { Block } from "@/types/documentation";
import { fileNameUtils } from '@/utils/fileNameUtils';

export const markdownExporter = {
  convertBlock: (block: Block): string => {
    switch (block.type) {
      case 'code':
        return `\`\`\`${block.language || ''}\n${block.content}\n\`\`\`\n\n`;
      case 'list':
        return block.content.split('\n')
          .filter(Boolean)
          .map(item => `  - ${item}`)
          .join('\n') + '\n\n';
      default:
        return `${block.content}\n\n`;
    }
  },

  exportToMarkdown: (blocks: Block[]): string => {
    return blocks
      .sort((a, b) => a.order - b.order)
      .map(block => markdownExporter.convertBlock(block))
      .join('');
  },

  downloadMarkdown: (blocks: Block[], filename = 'document') => {
    const markdown = markdownExporter.exportToMarkdown(blocks);
    const normalizedName = fileNameUtils.normalize(filename);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${normalizedName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
