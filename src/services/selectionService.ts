type SelectionState = {
  isSelecting: boolean;
  startPoint: { x: number; y: number } | null;
  currentPoint: { x: number; y: number } | null;
};

class SelectionService {
  private state: SelectionState = {
    isSelecting: false,
    startPoint: null,
    currentPoint: null
  };

  private listeners: Set<() => void> = new Set();

  start(x: number, y: number) {
    this.state = {
      isSelecting: true,
      startPoint: { x, y },
      currentPoint: { x, y }
    };
    this.notify();
  }

  update(x: number, y: number) {
    if (!this.state.isSelecting) return;
    this.state.currentPoint = { x, y };
    this.notify();
  }

  end() {
    this.state = {
      isSelecting: false,
      startPoint: null,
      currentPoint: null
    };
    this.notify();
  }

  getState() {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const selectionService = new SelectionService();
