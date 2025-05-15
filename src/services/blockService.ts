import { Block } from '@/types/documentation'

export interface ValidationError {
  field: string
  message: string
}

export interface BlockValidation {
  isValid: boolean
  errors: ValidationError[]
}

export interface BlockCreate {
  type: 'text' | 'list' | 'code'
  content?: string
  language?: string
}

export class BlockService {
  validateBlock(block: Block): BlockValidation {
    const errors: ValidationError[] = []

    if (!block.type) {
      errors.push({ field: 'type', message: 'Block type is required' })
    }

    switch (block.type) {
      case 'code':
        if (!block.language?.trim()) {
          errors.push({ field: 'language', message: 'Language is required for code blocks' })
        }
        break
      case 'list':
        if (!block.content.trim()) {
          errors.push({ field: 'content', message: 'List must have at least one item' })
        }
        break
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  createBlock(data: BlockCreate): Block {
    const block = {
      id: `block-${Date.now()}`,
      type: data.type,
      content: data.content || '',
      order: Date.now(),
      language: data.type
    }

    const validation = this.validateBlock(block)
    if (!validation.isValid) {
      throw new Error(validation.errors.map(e => e.message).join(', '))
    }

    return block
  }

  transformBlock(block: Block, newType: BlockCreate['type'], content?: string): Block {
    const transformedBlock = {
      ...block,
      type: newType,
      content: content || block.content,
      language: newType
    }

    const validation = this.validateBlock(transformedBlock)
    if (!validation.isValid) {
      throw new Error(validation.errors.map(e => e.message).join(', '))
    }

    return transformedBlock
  }

  updateBlock(block: Block, updates: Partial<Block>): Block {
    return {
      ...block,
      ...updates,
      updatedAt: new Date().toISOString()
    }
  }

  reorderBlocks(blocks: Block[], sourceIndex: number, destinationIndex: number): Block[] {
    const result = Array.from(blocks)
    const [removed] = result.splice(sourceIndex, 1)
    result.splice(destinationIndex, 0, removed)
    
    return result.map((block, index) => ({
      ...block,
      order: index
    }))
  }
}

export const blockService = new BlockService()
