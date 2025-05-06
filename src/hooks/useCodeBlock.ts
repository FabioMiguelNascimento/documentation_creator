import { useBlocks } from '@/contexts/BlockContext'
import { useCallback } from 'react'

export function useCodeBlock(id: string) {
  const { updateBlock, deleteBlock } = useBlocks()

  const handleUpdate = useCallback((content: string, language?: string) => {
    updateBlock(id, content, language)
  }, [id, updateBlock])

  const handleDelete = useCallback(() => {
    deleteBlock(id)
  }, [id, deleteBlock])

  return {
    handleUpdate,
    handleDelete
  }
}
