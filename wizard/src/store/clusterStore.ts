import { create } from 'zustand';
import type { Cluster } from '../types';
import { clusters as initialClusters } from '../data/clusters';

interface ClusterState {
  clusters: Cluster[];
  activeCluster: string;
  reorder: (fromIdx: number, toIdx: number) => void;
  setActive: (id: string) => void;
}

export const useClusterStore = create<ClusterState>((set) => ({
  clusters: [...initialClusters],
  activeCluster: 'all',
  reorder: (fromIdx, toIdx) =>
    set((s) => {
      const next = [...s.clusters];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return { clusters: next };
    }),
  setActive: (id) =>
    set((s) => ({ activeCluster: s.activeCluster === id ? 'all' : id })),
}));
