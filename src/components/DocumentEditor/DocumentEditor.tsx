import { Block } from '@/types/documentation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import CodeBlock from '../blocks/CodeBlock/CodeBlock';
import ListBlock from '../blocks/ListBlock/ListBlock';
import TextBlock from '../blocks/TextBlock/TextBlock';
import styles from './DocumentEditor.module.scss';

interface DocumentEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function DocumentEditor({ blocks, onChange }: DocumentEditorProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items.map((item, index) => ({ ...item, order: index })));
  };

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'code':
        return (
          <CodeBlock
            key={block.id}
            id={block.id}
            content={block.content}
            language={block.language}
            index={index}
            onChange={(id, content, language) => {
              const newBlocks = blocks.map(b =>
                b.id === id ? { ...b, content, language } : b
              );
              onChange(newBlocks);
            }}
          />
        );
      case 'list':
        return (
          <ListBlock
            key={block.id}
            id={block.id}
            content={block.content}
            index={index}
            onChange={(id, content) => {
              const newBlocks = blocks.map(b =>
                b.id === id ? { ...b, content } : b
              );
              onChange(newBlocks);
            }}
          />
        );
      default:
        return (
          <TextBlock
            key={block.id}
            id={block.id}
            content={block.content}
            index={index}
            onChange={(id, content) => {
              const newBlocks = blocks.map(b =>
                b.id === id ? { ...b, content } : b
              );
              onChange(newBlocks);
            }}
          />
        );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={styles.editor}
          >
            {blocks.map((block, index) => renderBlock(block, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
