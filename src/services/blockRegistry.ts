import { Block } from '@/types/documentation'
import { ValidationError } from './blockService'

export interface BlockConfig {
  type: Block['type']
  defaultContent: string
  allowedTransformations: Block['type'][]
  validate: (block: Block) => ValidationError[]
}

export class BlockRegistry {
  private configs = new Map<Block['type'], BlockConfig>()

  register(config: BlockConfig) {
    this.configs.set(config.type, config)
  }

  getConfig(type: Block['type']): BlockConfig | undefined {
    return this.configs.get(type)
  }

  getAllowedTransformations(type: Block['type']): Block['type'][] {
    return this.getConfig(type)?.allowedTransformations || []
  }

  validateBlock(block: Block): ValidationError[] {
    const config = this.getConfig(block.type)
    return config?.validate(block) || []
  }
}

const registry = new BlockRegistry()

registry.register({
  type: 'text',
  defaultContent: '',
  allowedTransformations: ['list', 'code'],
  validate: (block) => []
})

registry.register({
  type: 'list',
  defaultContent: '',
  allowedTransformations: ['text'],
  validate: (block) => {
    const errors: ValidationError[] = []
    if (!block.content.trim()) {
      errors.push({ field: 'content', message: 'List must have at least one item' })
    }
    return errors
  }
})

registry.register({
  type: 'code',
  defaultContent: '',
  allowedTransformations: ['text'],
  validate: (block) => {
    const errors: ValidationError[] = []
    if (!block.language?.trim()) {
      errors.push({ field: 'language', message: 'Language is required for code blocks' })
    }
    return errors
  }
})

export const blockRegistry = registry
