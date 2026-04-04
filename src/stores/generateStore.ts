import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GenerationResult } from '@/types/models';

export type GenerationState = 'idle' | 'checking_credits' | 'queued' | 'processing' | 'placing' | 'error';

interface GenerateState {
  // inputs
  prompt: string;
  selectedModel: string; // 'auto' or model id
  negativePrompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  enhancePrompt: boolean;

  // runtime
  generationState: GenerationState;
  activeGenerations: GenerationResult[];
  lastError: string | null;

  // credits (simple client-side mock for now)
  creditsBalance: number;

  // actions
  setPrompt: (prompt: string) => void;
  setSelectedModel: (model: string) => void;
  setNegativePrompt: (text: string) => void;
  setAspectRatio: (ratio: '1:1' | '16:9' | '9:16' | '4:3') => void;
  setGenerationState: (state: GenerationState) => void;
  addGeneration: (result: GenerationResult) => void;
  updateGeneration: (id: string, patch: Partial<GenerationResult>) => void;
  removeGeneration: (id: string) => void;
  setLastError: (error: string | null) => void;
}

export const useGenerateStore = create<GenerateState>()(
  immer((set) => ({
    prompt: '',
    selectedModel: 'auto',
    negativePrompt: '',
    aspectRatio: '1:1',
    enhancePrompt: false,
    generationState: 'idle',
    activeGenerations: [],
    lastError: null,
    creditsBalance: 500, // mock starting balance

    setPrompt: (prompt) =>
      set((state) => {
        state.prompt = prompt;
      }),

    setSelectedModel: (model) =>
      set((state) => {
        state.selectedModel = model;
      }),

    setNegativePrompt: (text) =>
      set((state) => {
        state.negativePrompt = text;
      }),

    setAspectRatio: (ratio) =>
      set((state) => {
        state.aspectRatio = ratio;
      }),

    setGenerationState: (s) =>
      set((state) => {
        state.generationState = s;
      }),

    addGeneration: (result) =>
      set((state) => {
        state.activeGenerations.push(result);
      }),

    updateGeneration: (id, patch) =>
      set((state) => {
        const idx = state.activeGenerations.findIndex((g) => g.id === id);
        if (idx !== -1) Object.assign(state.activeGenerations[idx], patch);
      }),

    removeGeneration: (id) =>
      set((state) => {
        state.activeGenerations = state.activeGenerations.filter((g) => g.id !== id);
      }),

    setLastError: (error) =>
      set((state) => {
        state.lastError = error;
      }),
  }))
);
