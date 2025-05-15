import { Block } from '@/types/documentation';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import CodeBlock from '../blocks/CodeBlock/CodeBlock';
import TextBlock from '../blocks/TextBlock/TextBlock';
import styles from './DocumentEditor.module.scss';

interface DocumentEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

export default function DocumentEditor({ blocks, onChange }: DocumentEditorProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reorderedBlocks = Array.from(blocks)
    const [removed] = reorderedBlocks.splice(result.source.index, 1)
    reorderedBlocks.splice(result.destination.index, 0, removed)
    onChange(reorderedBlocks)
  }

  return (
    <main className={styles.editor}>
      <div className={styles.container}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.blocksWrapper}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={styles.editor}
                >
                  {blocks.map((block, index) => {
                    switch (block.type) {
                      case 'code':
                        return <CodeBlock key={block.id} {...block} index={index} />
                      default:
                        return <TextBlock key={block.id} {...block} index={index} />
                    }
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </main>
  );
}
