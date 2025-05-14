import { Block } from "@/types/documentation";
import { fileNameUtils } from '@/utils/fileNameUtils';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentação</title>
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; }
      pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
      ul { padding-left: 1.5rem; }
    </style>
</head>
<body>
    {{content}}
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
    <script>Prism.highlightAll();</script>
</body>
</html>
`;

export const htmlExporter = {
  convertBlock: (block: Block): string => {
    switch (block.type) {
      case 'code':
        return `<pre><code class="language-${block.language}">${block.content}</code></pre>`;
      case 'list':
        const items = block.content.split('\n')
          .filter(Boolean)
          .map(item => `      <li>${item}</li>`)
          .join('\n');
        return `    <ul>\n${items}\n    </ul>`;
      default:
        return `<p>${block.content}</p>`;
    }
  },

  exportToHtml: (blocks: Block[]): string => {
    const content = blocks
      .sort((a, b) => a.order - b.order)
      .map(block => htmlExporter.convertBlock(block))
      .join('\n');

    return htmlTemplate.replace('{{content}}', content);
  },

  downloadHtml: (blocks: Block[], filename = 'document') => {
    const html = htmlExporter.exportToHtml(blocks);
    const normalizedName = fileNameUtils.normalize(filename);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${normalizedName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
