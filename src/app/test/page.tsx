'use client';
import DocumentEditor from '@/components/DocumentEditor/DocumentEditor';
import EditorSidebar from '@/components/EditorSidebar/EditorSidebar';
import { documentStorage } from '@/services/documentStorage';
import { htmlExporter } from '@/services/htmlExporter';
import { jsExporter } from '@/services/jsExporter';
import { markdownExporter } from '@/services/markdownExporter';
import { Block } from '@/types/documentation';
import { useEffect, useState } from 'react';

const initialBlocks: Block[] = [
  {
    id: '1',
    type: 'code',
    content: 'console.log("Hello World!");',
    language: 'javascript',
    order: 0
  }
];

export default function TestPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const savedBlocks = documentStorage.getBlocks();
    setBlocks(savedBlocks.length > 0 ? savedBlocks : initialBlocks);
  }, []);

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    documentStorage.saveBlocks(newBlocks);
  };

  const handleCreateBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: blocks.length,
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    documentStorage.saveBlocks(updatedBlocks);
  };

  const handleExport = (type: 'md' | 'html' | 'jsx') => {
    switch (type) {
      case 'md':
        markdownExporter.downloadMarkdown(blocks, 'test-document');
        break;
      case 'html':
        htmlExporter.downloadHtml(blocks, 'test-document');
        break;
      case 'jsx':
        jsExporter.downloadJs(blocks, 'test-document');
        break;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Editor de Documentação</h1>
        <DocumentEditor blocks={blocks} onChange={handleBlocksChange} />
      </div>
      <EditorSidebar onCreateBlock={handleCreateBlock} onExport={handleExport} />
    </div>
  );
}
