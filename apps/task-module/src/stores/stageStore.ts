import { create } from 'zustand';
import { Stage } from '../types';

interface StageState {
  stages: Stage[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setStages: (stages: Stage[]) => void;
  addStage: (stage: Stage) => void;
  updateStage: (id: string, updates: Partial<Stage>) => void;
  deleteStage: (id: string) => void;
  reorderStages: (stages: Stage[]) => void;
  fetchStages: () => Promise<void>;
  getStageById: (id: string) => Stage | undefined;
}

export const useStageStore = create<StageState>((set, get) => ({
  stages: [],
  loading: false,
  error: null,

  setStages: (stages) => set({ stages }),

  addStage: (stage) => set((state) => ({
    stages: [...state.stages, stage].sort((a, b) => a.order - b.order),
  })),

  updateStage: (id, updates) => set((state) => ({
    stages: state.stages
      .map((stage) =>
        stage.id === id ? { ...stage, ...updates, updatedAt: new Date().toISOString() } : stage
      )
      .sort((a, b) => a.order - b.order),
  })),

  deleteStage: (id) => set((state) => ({
    stages: state.stages.filter((stage) => stage.id !== id),
  })),

  reorderStages: (stages) => set({ stages }),

  fetchStages: async () => {
    set({ loading: true, error: null });
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '1';
      const response = await fetch(`http://localhost:3000/task/${companyId}.json`);
      if (!response.ok) throw new Error('Failed to fetch stages');
      const data = await response.json();
      set({ stages: (data.stages || []).sort((a: Stage, b: Stage) => a.order - b.order), loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getStageById: (id) => {
    return get().stages.find((stage) => stage.id === id);
  },
}));
