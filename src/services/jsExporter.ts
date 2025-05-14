import { Block } from "@/types/documentation";
import { fileNameUtils } from '@/utils/fileNameUtils';
import React from 'react';

const styles = `
.doc-viewer {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

.doc-viewer pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.doc-viewer ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.doc-viewer li {
  margin: 0.25rem 0;
}

.doc-viewer p {
  margin: 1rem 0;
}
`;

const componentTemplate = (blocks: Block[]) => `
function DocumentViewer({ React }) {
  const blocks = ${JSON.stringify(blocks, null, 2)};

  React.useEffect(() => {
    // Adicionar estilos ao documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = ${JSON.stringify(styles)};
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'code':
        return React.createElement('pre', { key: block.id },
          React.createElement('code', { className: \`language-\${block.language}\` },
            block.content
          )
        );
      case 'list':
        return React.createElement('ul', { key: block.id },
          block.content.split('\\n')
            .filter(Boolean)
            .map((item, i) => React.createElement('li', { key: i }, item))
        );
      default:
        return React.createElement('p', { key: block.id }, block.content);
    }
  };

  return React.createElement('div', { className: 'doc-viewer' },
    blocks.sort((a, b) => a.order - b.order).map(renderBlock)
  );
}`;

export const jsExporter = {
  exportToJs: (blocks: Block[]): string => {
    return componentTemplate(blocks);
  },

  downloadJs: (blocks: Block[], filename = 'DocumentViewer') => {
    const jsContent = jsExporter.exportToJs(blocks);
    const normalizedName = fileNameUtils.normalize(filename);
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${normalizedName}.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  getPreviewComponent: (blocks: Block[]) => {
    const jsCode = componentTemplate(blocks);
    const Component = eval(`(${jsCode})`);
    return () => Component({ React });
  }
};
