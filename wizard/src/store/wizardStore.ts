import { create } from 'zustand';
import type { InputMode, FileMeta } from '../types';

interface WizardState {
  currentStep: number;
  inputMode: InputMode;
  rawText: string;
  sourceFile: FileMeta | null;
  sampleId: string | null;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  setInputMode: (mode: InputMode) => void;
  setRawText: (text: string) => void;
  setSourceFile: (file: FileMeta) => void;
  setSampleId: (id: string) => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  inputMode: 'file',
  rawText: '',
  sourceFile: null,
  sampleId: null,
  next: () => set((s) => ({ currentStep: Math.min(6, s.currentStep + 1) })),
  back: () => set((s) => ({ currentStep: Math.max(1, s.currentStep - 1) })),
  goTo: (step: number) => set({ currentStep: step }),
  setInputMode: (mode: InputMode) => set({ inputMode: mode }),
  setRawText: (text: string) => set({ rawText: text }),
  setSourceFile: (file: FileMeta) => set({ sourceFile: file }),
  setSampleId: (id: string) => set({ sampleId: id }),
}));
