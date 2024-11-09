import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
  points: number;
  updatePoints: (points: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      points: 0,
      updatePoints: (points) => set({ points }),
    }),
    {
      name: 'cs-exam-prep-storage',
    }
  )
);