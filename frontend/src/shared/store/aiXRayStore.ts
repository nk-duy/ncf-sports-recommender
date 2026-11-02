import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AiXRayState {
  isXRayActive: boolean;
  toggleXRay: () => void;
  setXRayActive: (active: boolean) => void;
}

export const useAiXRayStore = create<AiXRayState>()(
  persist(
    (set) => ({
      isXRayActive: false,
      toggleXRay: () => set((state) => ({ isXRayActive: !state.isXRayActive })),
      setXRayActive: (active: boolean) => set({ isXRayActive: active }),
    }),
    {
      name: 'kady-ai-xray-mode',
    }
  )
);
