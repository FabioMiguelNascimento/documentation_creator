import { blockEvents } from '@/services/blockEvents'
import { BlockService, blockService } from '@/services/blockService'
import { blockState } from '@/services/blockState'
import { Block, Documentation } from '@/types/documentation'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

interface BlockContextValue {
  blocks: Block[]
  service: BlockService
  createBlock: (type: Block['type'], content?: string) => void
  updateBlock: (id: string, content: string, language?: string) => void
  transformBlock: (id: string, newType: Block['type'], content?: string) => Block | undefined
  deleteBlock: (id: string) => void
  reorderBlocks: (sourceIndex: number, destinationIndex: number) => void
  setInitialBlocks: (blocks: Block[]) => void
}

const BlockContext = createContext<BlockContextValue | null>(null)

export function BlockProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([])

  const setInitialBlocks = useCallback((initialBlocks: Block[]) => {
    setBlocks(initialBlocks)
    blockState.setBlocks(initialBlocks)
  }, [])

  const createBlock = useCallback((type: Block['type'], content?: string) => {
    const block = blockService.createBlock({ type, content })
    const newBlocks = [...blocks, block]
    setBlocks(newBlocks)
    blockState.setBlocks(newBlocks)
    blockEvents.emit('create', { block })
  }, [blocks])

  const updateBlock = useCallback((id: string, content: string, language?: string) => {
    const block = blockState.getBlock(id)
    if (!block) return

    const updatedBlock = {
      ...block,
      content,
      language: language !== undefined ? language : block.language
    }

    const newBlocks = blocks.map(b => b.id === id ? updatedBlock : b)
    setBlocks(newBlocks)
    blockState.setBlocks(newBlocks)
    blockEvents.emit('update', { block: updatedBlock, changes: { content, language } })
  }, [blocks])

  const transformBlock = useCallback((id: string, newType: Block['type'], content?: string) => {
    const block = blockState.getBlock(id)
    if (!block) return;

    const previousType = block.type
    const transformedBlock = blockService.transformBlock(block, newType, content)
    const newBlocks = blocks.map(b => b.id === id ? transformedBlock : b)
    setBlocks(newBlocks)
    blockState.setBlocks(newBlocks)
    blockEvents.emit('transform', { block: transformedBlock, previousType })
    return transformedBlock
  }, [blocks])

  const deleteBlock = useCallback((id: string) => {
    const blockToDelete = blockState.getBlock(id)
    if (!blockToDelete) return

    const newBlocks = blocks.filter(b => b.id !== id)
    setBlocks(newBlocks)
    blockState.setBlocks(newBlocks)
    blockEvents.emit('delete', { block: blockToDelete })
  }, [blocks])

  const reorderBlocks = useCallback((sourceIndex: number, destinationIndex: number) => {
    const reorderedBlocks = blockService.reorderBlocks(blocks, sourceIndex, destinationIndex)
    setBlocks(reorderedBlocks)
    blockState.setBlocks(reorderedBlocks)
    blockEvents.emit('reorder', { blocks: reorderedBlocks, sourceIndex, destinationIndex })
  }, [blocks])

  useEffect(() => {
    const savedDocs = localStorage.getItem('docs')
    if (savedDocs) {
      const docs = JSON.parse(savedDocs)
      const updatedDocs = docs.map((doc: Documentation) => ({
        ...doc,
        blocks: doc.blocks.map(block => {
          const updatedBlock = blocks.find(b => b.id === block.id)
          return updatedBlock || block
        })
      }))
      localStorage.setItem('docs', JSON.stringify(updatedDocs))
    }
  }, [blocks])

  return (
    <BlockContext.Provider value={{
      blocks,
      service: blockService,
      createBlock,
      updateBlock,
      transformBlock,
      deleteBlock,
      reorderBlocks,
      setInitialBlocks
    }}>
      {children}
    </BlockContext.Provider>
  )
}

export const useBlocks = () => {
  const context = useContext(BlockContext)
  if (!context) throw new Error('useBlocks must be used within BlockProvider')
  return context
}
