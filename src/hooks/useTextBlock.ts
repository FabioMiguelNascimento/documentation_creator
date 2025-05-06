import { useBlocks } from '@/contexts/BlockContext'
import { useCallback } from 'react'

export function useTextBlock(id: string) {
  const { updateBlock, transformBlock, deleteBlock } = useBlocks()

  const handleUpdate = useCallback((content: string) => {
    updateBlock(id, content)
  }, [id, updateBlock])

  const handleTransform = useCallback((newType: 'list' | 'code', content?: string) => {
    transformBlock(id, newType, content)
  }, [id, transformBlock])

  const handleDelete = useCallback(() => {
    deleteBlock(id)
  }, [id, deleteBlock])

  return {
    handleUpdate,
    handleTransform,
    handleDelete
  }
}
