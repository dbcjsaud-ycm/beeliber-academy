import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CanvasElement, ActivTool, ViewportState } from '@/types/canvas';

interface CanvasState {
  // viewport
  viewport: ViewportState;
  // elements on current page
  elements: CanvasElement[];
  selectedIds: string[];
  activeTool: ActivTool;
  // history (simple undo stack)
  history: CanvasElement[][];
  historyIndex: number;

  // actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setActiveTool: (tool: ActivTool) => void;
  addElement: (el: CanvasElement) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  immer((set) => ({
    viewport: { zoom: 1, panX: 0, panY: 0 },
    elements: [],
    selectedIds: [],
    activeTool: 'select',
    history: [],
    historyIndex: -1,

    setZoom: (zoom) =>
      set((state) => {
        state.viewport.zoom = Math.min(Math.max(zoom, 0.1), 5);
      }),

    setPan: (x, y) =>
      set((state) => {
        state.viewport.panX = x;
        state.viewport.panY = y;
      }),

    setActiveTool: (tool) =>
      set((state) => {
        state.activeTool = tool;
      }),

    addElement: (el) =>
      set((state) => {
        state.elements.push(el);
        // snapshot for undo
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.elements]);
        state.historyIndex = state.history.length - 1;
      }),

    updateElement: (id, patch) =>
      set((state) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx !== -1) Object.assign(state.elements[idx], patch);
      }),

    removeElement: (id) =>
      set((state) => {
        state.elements = state.elements.filter((e) => e.id !== id);
        state.selectedIds = state.selectedIds.filter((s) => s !== id);
      }),

    setSelectedIds: (ids) =>
      set((state) => {
        state.selectedIds = ids;
      }),

    clearCanvas: () =>
      set((state) => {
        state.elements = [];
        state.selectedIds = [];
        state.history = [];
        state.historyIndex = -1;
      }),
  }))
);
