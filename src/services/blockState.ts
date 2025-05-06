import { Block } from '@/types/documentation'

interface BlockStateSnapshot {
  blocks: Block[]
  timestamp: number
}

export class BlockState {
  private blocks: Block[] = []
  private cache = new Map<string, Block>()
  private history: BlockStateSnapshot[] = []
  private maxHistorySize = 100

  getBlocks(): Block[] {
    return [...this.blocks]
  }

  getBlock(id: string): Block | undefined {
    if (this.cache.has(id)) {
      return this.cache.get(id)
    }
    const block = this.blocks.find(b => b.id === id)
    if (block) {
      this.cache.set(id, block)
    }
    return block
  }

  setBlocks(blocks: Block[]) {
    this.saveSnapshot()
    this.blocks = blocks
    this.updateCache(blocks)
  }

  private updateCache(blocks: Block[]) {
    this.cache.clear()
    blocks.forEach(block => {
      this.cache.set(block.id, block)
    })
  }

  private saveSnapshot() {
    this.history.push({
      blocks: [...this.blocks],
      timestamp: Date.now()
    })

    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  undo(): boolean {
    const previousState = this.history.pop()
    if (previousState) {
      this.blocks = previousState.blocks
      this.updateCache(previousState.blocks)
      return true
    }
    return false
  }

  clearHistory() {
    this.history = []
  }
}

export const blockState = new BlockState()
