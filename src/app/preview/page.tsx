'use client';
import { documentStorage } from '@/services/documentStorage';
import { jsExporter } from '@/services/jsExporter';
import { Block } from '@/types/documentation';
import { useEffect, useState } from 'react';

export default function PreviewPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [PreviewComponent, setPreviewComponent] = useState<any>(null);

  useEffect(() => {
    try {
      const savedBlocks = documentStorage.getBlocks();
      setBlocks(savedBlocks);
      
      const DynamicComponent = jsExporter.getPreviewComponent(savedBlocks);
      setPreviewComponent(() => DynamicComponent);
    } catch (error) {
      console.error('Error creating preview:', error);
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Preview do Componente</h1>
        <a href="/test" style={{ color: 'blue', textDecoration: 'underline' }}>
          Voltar para Edição
        </a>
      </div>
      
      {PreviewComponent && (
        <div style={{ border: '1px solid #eaeaea', padding: '2rem', borderRadius: '8px' }}>
          <PreviewComponent />
        </div>
      )}
    </div>
  );
}
