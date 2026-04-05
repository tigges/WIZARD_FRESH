import { create } from 'zustand';
import type { InputMode, FileMeta } from '../types';

interface WizardState {
  currentStep: number;
  inputMode: InputMode;
  rawText: string;
  sourceFile: FileMeta | null;
  sampleId: string | null;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  setInputMode: (mode: InputMode) => void;
  setRawText: (text: string) => void;
  setSourceFile: (file: FileMeta | null) => void;
  setSampleId: (id: string | null) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  inputMode: 'file',
  rawText: '',
  sourceFile: null,
  sampleId: null,
  goTo: (step) => set({ currentStep: Math.max(1, Math.min(6, step)) }),
  next: () => set((s) => ({ currentStep: Math.min(6, s.currentStep + 1) })),
  back: () => set((s) => ({ currentStep: Math.max(1, s.currentStep - 1) })),
  setInputMode: (mode) => set({ inputMode: mode }),
  setRawText: (text) => set({ rawText: text }),
  setSourceFile: (file) => set({ sourceFile: file }),
  setSampleId: (id) => set({ sampleId: id }),
}));
