'use client';
import CodeBlock from '@/components/blocks/CodeBlock/CodeBlock';
import TextBlock from '@/components/blocks/TextBlock/TextBlock';
import { BlockProvider, useBlocks } from '@/contexts/BlockContext';
import { Block, Documentation } from '@/types/documentation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

function DocContent({ doc, setDoc }: { doc: Documentation; setDoc: (doc: Documentation) => void }) {
  const { setInitialBlocks } = useBlocks();

  useEffect(() => {
    if (doc) {
      const savedDocs = localStorage.getItem('docs');
      if (savedDocs) {
        const docs = JSON.parse(savedDocs);
        const currentDoc = docs.find((d: Documentation) => d.id === doc.id);
        if (currentDoc) {
          setInitialBlocks(currentDoc.blocks);
        }
      }
    }
  }, [doc, setInitialBlocks]);

  const handleTitleChange = (newTitle: string) => {
    if (!doc) return;
    const updatedDoc = { ...doc, title: newTitle, updatedAt: new Date().toISOString() };
    updateDocument(updatedDoc);
  };

  const handleDescriptionChange = (newDescription: string) => {
    if (!doc) return;
    const updatedDoc = { ...doc, description: newDescription, updatedAt: new Date().toISOString() };
    updateDocument(updatedDoc);
  };

  const handleCreateBlock = (type: 'text' | 'code' = 'text') => {
    if (!doc) return;

    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: doc.blocks.length,
    };

    const updatedDoc = {
      ...doc,
      blocks: [...doc.blocks, newBlock],
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);
  };

  const handleCreateBlockAfter = (afterBlockId: string, type: 'text' | 'code' = 'text') => {
    if (!doc) return;

    const blocks = doc.blocks;
    const blockIndex = blocks.findIndex(b => b.id === afterBlockId);
    if (blockIndex === -1) return;

    const currentBlock = blocks[blockIndex];
    const previousOrder = currentBlock?.order || 0;
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: previousOrder + 1,
    };

    const updatedBlocks = [
      ...blocks.slice(0, blockIndex + 1),
      newBlock,
      ...blocks.slice(blockIndex + 1)
    ].map((block, index) => ({ ...block, order: index }));

    const updatedDoc = {
      ...doc,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);

    setTimeout(() => {
      const newBlockElement = document.getElementById(newBlock.id);
      if (newBlockElement) {
        const editableContent = newBlockElement.querySelector('[contenteditable]');
        editableContent?.focus();
      }
    }, 0);

    return newBlock.id;
  };

  const handleBlockChange = (blockId: string, content: string) => {
    if (!doc) return;

    const updatedBlocks = doc.blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    );

    const updatedDoc = {
      ...doc,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!doc) return;

    const blockIndex = doc.blocks.findIndex(block => block.id === blockId);
    const nextBlockId = doc.blocks[blockIndex + 1]?.id || doc.blocks[blockIndex - 1]?.id;

    const updatedDoc = {
      ...doc,
      blocks: doc.blocks.filter(block => block.id !== blockId),
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);

    // Foca o próximo bloco
    if (nextBlockId) {
      setTimeout(() => {
        const nextBlock = document.getElementById(nextBlockId);
        if (nextBlock) {
          const editableContent = nextBlock.querySelector('[contenteditable]');
          editableContent?.focus();
        }
      }, 0);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!doc || !result.destination) return;

    const items = Array.from(doc.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedDoc = {
      ...doc,
      blocks: items.map((block, index) => ({ ...block, order: index })),
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);
  };

  const handleTransformBlock = (
    blockId: string, 
    newType: 'text' | 'code', 
    content: string,
    language?: string
  ) => {
    if (!doc) return;

    const updatedBlocks = doc.blocks.map(block =>
      block.id === blockId 
        ? { 
            ...block, 
            type: newType, 
            content,
            language: language || block.language 
          } 
        : block
    );

    const updatedDoc = {
      ...doc,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString()
    };

    updateDocument(updatedDoc);
  };

  const updateDocument = (updatedDoc: Documentation) => {
    const savedDocs = localStorage.getItem('docs');
    if (savedDocs) {
      const docs: Documentation[] = JSON.parse(savedDocs);
      const updatedDocs = docs.map(d => d.id === updatedDoc.id ? updatedDoc : d);
      localStorage.setItem('docs', JSON.stringify(updatedDocs));
      setDoc(updatedDoc);
    }
  };

  const hasEmptyBlockAtEnd = () => {
    if (!doc || doc.blocks.length === 0) return false;
    const lastBlock = doc.blocks[doc.blocks.length - 1];
    return lastBlock.type === 'text' && !lastBlock.content.trim();
  };

  const renderBlock = (block: Block, index: number) => {
    const commonProps = {
      key: block.id,
      id: block.id,
      content: block.content,
      index,
      onChange: handleBlockChange,
      onDelete: handleDeleteBlock,
      onTransform: handleTransformBlock,
      onEnter: (blockId: string) => handleCreateBlockAfter(blockId)
    };

    switch (block.type) {
      case 'code':
        return (
          <CodeBlock
            {...commonProps}
            language={block.language}
          />
        );
      default:
        return (
          <TextBlock
            {...commonProps}
          />
        );
    }
  };

  useEffect(() => {
    if (doc && !hasEmptyBlockAtEnd()) {
      handleCreateBlock('text');
    }
  }, [doc?.blocks]);

  return (
    <div className={styles.docContainer}>
      <header>
        <div
          contentEditable
          suppressContentEditableWarning
          className={styles.editableTitle}
          onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
        >
          {doc.title}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          className={styles.editableDescription}
          onBlur={(e) => handleDescriptionChange(e.currentTarget.textContent || '')}
        >
          {doc.description}
        </div>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.blocks}
            >
              {doc.blocks.map((block, index) => renderBlock(block, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {doc.blocks.length === 0 && (
        <button
          className={styles.addBlock}
          onClick={() => handleCreateBlock('text')}
        >
          + Adicionar bloco
        </button>
      )}
    </div>
  );
}

export default function DocPage() {
  const params = useParams();
  const [doc, setDoc] = useState<Documentation | null>(null);

  useEffect(() => {
    const savedDocs = localStorage.getItem('docs');
    if (savedDocs) {
      const docs: Documentation[] = JSON.parse(savedDocs);
      const currentDoc = docs.find(d => d.slug === params.slug);
      if (currentDoc) setDoc(currentDoc);
    }
  }, [params.slug]);

  if (!doc) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
    </div>
  )

  return (
    <BlockProvider>
      <DocContent doc={doc} setDoc={setDoc} />
    </BlockProvider>
  );
}
