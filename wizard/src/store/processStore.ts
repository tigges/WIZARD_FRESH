import { create } from 'zustand';
import type { Process } from '../types';
import { processes as initialProcesses } from '../data/processes';

interface ProcessState {
  processes: Process[];
  expanded: Record<number, boolean>;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  updateLabel: (id: number, label: string) => void;
  updateType: (id: number, type: string) => void;
  updateStepType: (id: number, stepId: string, type: string) => void;
}

export const useProcessStore = create<ProcessState>((set) => ({
  processes: initialProcesses,
  expanded: {},
  toggle: (id) =>
    set((s) => ({ expanded: { ...s.expanded, [id]: !s.expanded[id] } })),
  remove: (id) =>
    set((s) => ({ processes: s.processes.filter((p) => p.id !== id) })),
  updateLabel: (id, label) =>
    set((s) => ({
      processes: s.processes.map((p) =>
        p.id === id ? { ...p, label } : p,
      ),
    })),
  updateType: (id, type) =>
    set((s) => ({
      processes: s.processes.map((p) =>
        p.id === id ? { ...p, type } : p,
      ),
    })),
  updateStepType: (id, stepId, type) =>
    set((s) => ({
      processes: s.processes.map((p) =>
        p.id === id
          ? {
              ...p,
              steps: p.steps.map((st) =>
                st.id === stepId ? { ...st, type } : st,
              ),
            }
          : p,
      ),
    })),
}));
