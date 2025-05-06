import { Block } from '@/types/documentation';

type BlockEventType = 'create' | 'transform' | 'update' | 'reorder'

interface BlockEventPayload {
  create: { block: Block }
  transform: { block: Block; previousType: Block['type'] }
  update: { block: Block; changes: Partial<Block> }
  reorder: { blocks: Block[]; sourceIndex: number; destinationIndex: number }
}

type BlockEventCallback<T extends BlockEventType> = (payload: BlockEventPayload[T]) => void

export class BlockEvents {
  private listeners = new Map<BlockEventType, Set<BlockEventCallback<any>>>()

  on<T extends BlockEventType>(event: T, callback: BlockEventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)

    return () => this.off(event, callback)
  }

  off<T extends BlockEventType>(event: T, callback: BlockEventCallback<T>) {
    this.listeners.get(event)?.delete(callback)
  }

  emit<T extends BlockEventType>(event: T, payload: BlockEventPayload[T]) {
    this.listeners.get(event)?.forEach(callback => callback(payload))
  }

  clear() {
    this.listeners.clear()
  }
}

export const blockEvents = new BlockEvents()
