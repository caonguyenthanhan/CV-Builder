import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DownloadRecord {
  id: string;
  fileName: string;
  timestamp: string;
  type: 'pdf' | 'print';
}

interface DownloadHistoryStore {
  history: DownloadRecord[];
  addRecord: (record: Omit<DownloadRecord, 'id'>) => void;
  clearHistory: () => void;
}

export const useDownloadHistoryStore = create<DownloadHistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addRecord: (record) => set((state) => ({
        history: [{ ...record, id: crypto.randomUUID() }, ...state.history].slice(0, 50) // Keep last 50
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'cv-download-history',
    }
  )
);
