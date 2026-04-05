import { create } from 'zustand';

interface CanvasState {
  activeCluster: string;
  tool: 'select' | 'hand';
  setCluster: (id: string) => void;
  setTool: (t: 'select' | 'hand') => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  activeCluster: 'with',
  tool: 'select',
  setCluster: (id) => set({ activeCluster: id }),
  setTool: (t) => set({ tool: t }),
}));
